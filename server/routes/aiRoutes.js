import express from 'express';
import { DataStore } from '../config/dataStore.js';

const router = express.Router();

// @route   POST /api/ai/chat
// @desc    CampusAI Intelligent Chat Endpoint (Real Database Context + Gemini AI + Dynamic Engine)
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Prompt message is required.' });
    }

    // 1. Fetch Real Database Context for CampusAI
    let liveNotices = [];
    let messMenu = { breakfast: 'Puri Bhaji, Tea', lunch: 'Rice, Dal, Paneer Butter Masala, Curd', dinner: 'Roti, Dal, Mix Veg, Sweets' };
    let requests = [];
    let complaints = [];
    let timetable = [];
    let fees = { totalAmount: 85000, paidAmount: 85000, dueAmount: 0 };

    try {
      liveNotices = await DataStore.getAllNotices();
      messMenu = await DataStore.getMessMenu();
      requests = await DataStore.getAllRequests();
      complaints = await DataStore.getAllComplaints();
      timetable = await DataStore.getTimetable('mem_user_student_1');
      fees = await DataStore.getFeeDetails('mem_user_student_1');
    } catch (dbErr) {
      console.warn('[CampusAI] Note fetching live DB context:', dbErr.message);
    }

    const pendingRequests = requests.filter((r) => r.status === 'Pending');
    const pendingComplaints = complaints.filter((c) => c.status === 'Pending' || c.status === 'In Progress');

    const liveDataContext = `
REAL-TIME DATABASE CONTEXT (BPUT AUTONOMOUS CAMPUS):
- Current Student: Rahul Sharma (Roll No: 2201105042, CSE 6th Sem)
- Active Notices in DB: ${liveNotices.slice(0, 3).map((n) => `[${n.category || 'Notice'}] ${n.title}`).join('; ') || 'No new notices'}
- Today's Mess Menu in DB: Breakfast: ${messMenu.breakfast || 'Puri Bhaji'}, Lunch: ${messMenu.lunch || 'Rice, Dal, Paneer'}, Dinner: ${messMenu.dinner || 'Roti, Dal, Mix Veg'}
- Student Requests in DB: Total ${requests.length} (${pendingRequests.length} Pending approval)
- Student Grievances in DB: Total ${complaints.length} (${pendingComplaints.length} Under review)
- Fee Status in DB: Total ₹${fees.totalAmount || 85000}, Paid ₹${fees.paidAmount || 85000}, Due Balance ₹${fees.dueAmount || 0}
- Class Timetable: ${timetable.slice(0, 3).map((t) => `${t.day || 'Mon'}: ${t.subject} (${t.time})`).join('; ') || 'Classes 09:00 AM - 04:00 PM'}
`;

    const systemInstruction = `You are CampusAI, the official 24/7 AI Assistant for CampusOS at BPUT Autonomous Campus.
Your goal is to simplify everyday campus life for students, teachers, and administrators.
You have ACCESS TO REAL LIVE CAMPUS DATABASE DATA:
${liveDataContext}

Always provide accurate, specific answers using the real database information above.
Keep answers concise, helpful, friendly, and well-formatted in Markdown.`;

    const lower = message.toLowerCase();

    // 2. Try real Gemini AI API call
    if (apiKey && apiKey.length > 5) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: `${systemInstruction}\n\nUser Question: ${message}` }],
                },
              ],
              generationConfig: {
                temperature: 0.6,
                maxOutputTokens: 600,
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            let actionLink = null;
            let actionLabel = null;
            if (lower.includes('gate pass') || lower.includes('outing')) {
              actionLink = '/student/gate-pass';
              actionLabel = 'Open Gate Pass Form';
            } else if (lower.includes('leave')) {
              actionLink = '/student/leave';
              actionLabel = 'Apply for Leave';
            } else if (lower.includes('complaint') || lower.includes('grievance')) {
              actionLink = '/student/complaints';
              actionLabel = 'Lodge Complaint';
            } else if (lower.includes('timetable') || lower.includes('schedule') || lower.includes('class')) {
              actionLink = '/student/timetable';
              actionLabel = 'View Timetable';
            } else if (lower.includes('request') || lower.includes('status')) {
              actionLink = '/student/requests';
              actionLabel = 'View My Requests';
            } else if (lower.includes('fee') || lower.includes('due') || lower.includes('pay')) {
              actionLink = '/student/fees';
              actionLabel = 'View Fees & Pay';
            }
            return res.json({ response: text, actionLink, actionLabel, poweredBy: 'Gemini AI 1.5 Flash' });
          }
        }
      } catch (geminiErr) {
        console.warn('[CampusAI] Gemini API call note, fallback to real DB engine:', geminiErr.message);
      }
    }

    // 3. Real Database Dynamic Engine (Fallback when API key offline)
    let replyText = '';
    let actionLink = null;
    let actionLabel = null;

    if (lower.includes('gate pass') || lower.includes('exit') || lower.includes('outing')) {
      replyText = `To apply for a Digital Gate Pass:\n1. Open **Gate Pass** from your menu.\n2. Fill in exit date, time, and destination.\n3. Submit for warden verification to get instant QR permit!`;
      actionLink = '/student/gate-pass';
      actionLabel = 'Open Gate Pass Form';
    } else if (lower.includes('leave') || lower.includes('sick') || lower.includes('absent')) {
      replyText = `To submit a Leave Application:\n1. Open **Leave Apply** from your menu.\n2. Choose Medical or Academic leave.\n3. Enter dates and reason to send to faculty for approval.`;
      actionLink = '/student/leave';
      actionLabel = 'Apply for Leave';
    } else if (lower.includes('pending request') || lower.includes('request status') || lower.includes('my request')) {
      if (pendingRequests.length > 0) {
        replyText = `You currently have **${pendingRequests.length} pending request(s)** in the database:\n` +
          pendingRequests.map((r) => `• **${r.title}** (${r.type}) — Status: *${r.status}*`).join('\n');
      } else {
        replyText = `You have no pending requests in the database right now. All submitted requests are processed!`;
      }
      actionLink = '/student/requests';
      actionLabel = 'View All Requests';
    } else if (lower.includes('complaint') || lower.includes('repair') || lower.includes('wifi') || lower.includes('water')) {
      if (pendingComplaints.length > 0) {
        replyText = `Active Grievance Tracked in DB:\n` +
          pendingComplaints.map((c) => `• **${c.title}** [${c.category}] — Status: *${c.status}*`).join('\n');
      } else {
        replyText = `Need to report a campus issue? You can lodge a maintenance, electrical, or hostel complaint under **Complaints**.`;
      }
      actionLink = '/student/complaints';
      actionLabel = 'Lodge Complaint';
    } else if (lower.includes('mess') || lower.includes('food') || lower.includes('menu')) {
      replyText = `**Today's Mess Menu from Campus Database:**\n\n• 🥣 **Breakfast**: ${messMenu.breakfast || 'Puri Bhaji, Tea'}\n• 🍲 **Lunch**: ${messMenu.lunch || 'Rice, Dal, Paneer Butter Masala, Curd'}\n• 🫓 **Dinner**: ${messMenu.dinner || 'Roti, Dal, Mix Veg, Sweets'}`;
      actionLink = '/student/mess-menu';
      actionLabel = 'View Full Mess Schedule';
    } else if (lower.includes('timetable') || lower.includes('schedule') || lower.includes('class') || lower.includes('next class')) {
      replyText = `**Weekly Class Timetable (B.Tech CSE 6th Sem):**\n` +
        (timetable.length > 0
          ? timetable.map((t) => `• **${t.subject}** (${t.code}) | ${t.time} | Room: ${t.room}`).join('\n')
          : '• Data Structures & Algorithms (CSE-301) | 09:00 AM - 10:00 AM\n• Database Management (CSE-304) | 10:15 AM - 11:15 AM');
      actionLink = '/student/timetable';
      actionLabel = 'View Timetable';
    } else if (lower.includes('fee') || lower.includes('due') || lower.includes('pay') || lower.includes('balance')) {
      replyText = `**Semester Fee Summary from Database:**\n• Total Fee: ₹${fees.totalAmount?.toLocaleString() || '85,000'}\n• Paid Amount: ₹${fees.paidAmount?.toLocaleString() || '85,000'}\n• **Due Balance**: ₹${fees.dueAmount?.toLocaleString() || '0'}`;
      actionLink = '/student/fees';
      actionLabel = 'View Fee Details';
    } else {
      replyText = `CampusAI is here to help! I am connected to your live campus database. I can assist you with Gate Passes, Leave Applications, Mess Menus, Class Timetables, and Fee Receipts.`;
      actionLink = '/student/services';
      actionLabel = 'Explore Services';
    }

    return res.json({ response: replyText, actionLink, actionLabel, poweredBy: 'CampusOS Database Engine' });
  } catch (error) {
    console.error('[CampusAI Error]', error);
    res.status(500).json({ message: 'Error generating AI response.' });
  }
});

export default router;
