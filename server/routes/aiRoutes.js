import express from 'express';
import { DataStore } from '../config/dataStore.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/ai/chat
// @desc    CampusAI Intelligent Chat Endpoint (Real Authenticated User DB Context + Gemini AI)
router.post('/chat', protect, async (req, res) => {
  try {
    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Prompt message is required.' });
    }

    const user = req.user;

    // Fetch live user-specific data from real DB
    let liveNotices = [];
    let requests = [];
    let complaints = [];
    let timetable = [];
    let fees = { totalAmount: 0, paidAmount: 0, dueAmount: 0 };

    try {
      liveNotices = await DataStore.getAllNotices();
      requests = await DataStore.getAllRequests({ userId: user._id });
      complaints = await DataStore.getAllComplaints({ userId: user._id });
      timetable = await DataStore.getTimetable({
        branch: user.department || user.branch,
        semester: user.semester
      });
      fees = await DataStore.getFeeDetails(user._id);
    } catch (dbErr) {
      console.warn('[CampusAI] Note fetching live DB context:', dbErr.message);
    }

    // Notice targeting
    const relevantNotices = liveNotices.filter(n => {
      if (!n.targetAudience || n.targetAudience === 'All') return true;
      if (user.role === 'student' && n.targetAudience === 'Students') return true;
      if (user.role === 'teacher' && n.targetAudience === 'Teachers') return true;
      if (n.targetAudience === 'Department' && n.targetDepartment === (user.department || user.branch)) return true;
      return false;
    });

    const pendingRequests = requests.filter((r) => r.status === 'Pending' || r.status === 'pending');
    const pendingComplaints = complaints.filter((c) => c.status === 'Pending' || c.status === 'In Progress');

    const liveDataContext = `
REAL-TIME AUTHENTICATED USER CONTEXT (BPUT AUTONOMOUS CAMPUS):
- Authenticated User: ${user.name} (${user.role.toUpperCase()})
- ID / Roll: ${user.studentId || user.rollNo || user.employeeId || 'N/A'}
- Department / Branch: ${user.department || user.branch || 'N/A'}
- Course & Semester: ${user.course || 'B.Tech'} (${user.semester || 'N/A'})
- Relevant Notices in DB: ${relevantNotices.slice(0, 3).map((n) => `[${n.category || 'Notice'}] ${n.title}`).join('; ') || 'No active notices'}
- My Submitted Requests in DB: Total ${requests.length} (${pendingRequests.length} Pending)
- My Complaints in DB: Total ${complaints.length} (${pendingComplaints.length} In Progress)
- Fee Details: Total ₹${fees.totalAmount || 0}, Paid ₹${fees.paidAmount || 0}, Due ₹${fees.dueAmount || 0}
- Class Timetable: ${timetable.slice(0, 4).map((t) => `${t.day}: ${t.subject} (${t.time} Room ${t.roomNo || t.room})`).join('; ') || 'No scheduled classes found'}
`;

    const systemInstruction = `You are CampusAI, the official 24/7 AI Assistant for CampusOS.
You provide accurate, helpful responses using ONLY the authenticated user's real database context:
${liveDataContext}

Rule: Always maintain privacy and answer questions specifically related to ${user.name}'s campus records.
Keep answers concise, helpful, polite, and nicely formatted in Markdown.`;

    const lower = message.toLowerCase();

    // Try Gemini API call if key present
    if (apiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: `${systemInstruction}\n\nUser Question: ${message}` }
                  ]
                }
              ]
            })
          }
        );

        if (response.ok) {
          const aiData = await response.json();
          const reply = aiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return res.json({ reply, response: reply, source: 'gemini-ai' });
          }
        }
      } catch (e) {
        console.warn('[CampusAI] Gemini API error, switching to contextual response engine:', e.message);
      }
    }

    // Context-driven intelligence engine fallback
    let reply = `Hello ${user.name}! I am CampusAI. How can I assist you with your campus services today?`;

    if (lower.includes('attendance')) {
      reply = `Hello ${user.name}! Your database record shows you are enrolled in ${user.department || 'your department'}. You can view your real-time subject-wise attendance break-up under the **Attendance** tab in your portal.`;
    } else if (lower.includes('timetable') || lower.includes('class') || lower.includes('schedule')) {
      if (timetable.length > 0) {
        reply = `Here is your upcoming schedule based on your database allocation for **${user.department} (${user.semester})**:\n\n` +
          timetable.slice(0, 4).map(t => `- **${t.day}**: ${t.subject} (${t.time}) in Room **${t.roomNo || t.room}** by ${t.teacher}`).join('\n');
      } else {
        reply = `No timetable slots are currently assigned for your section in the database. Please check back later or contact your department admin.`;
      }
    } else if (lower.includes('mess') || lower.includes('food') || lower.includes('menu') || lower.includes('breakfast') || lower.includes('lunch') || lower.includes('dinner')) {
      try {
        const messData = await DataStore.getMessDetails();
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = days[new Date().getDay()];
        const todayMenu = messData?.menu?.[today] || messData?.menu?.Tuesday;
        if (todayMenu) {
          reply = `**Mess Menu Summary (${today} - ${messData?.hostel || 'Kalpana Chawla Hall'})**:\n` +
            `- 🍳 **Breakfast**: ${todayMenu.breakfast}\n` +
            `- 🍛 **Lunch**: ${todayMenu.lunch}\n` +
            `- ☕ **Snacks**: ${todayMenu.snacks}\n` +
            `- 🍱 **Dinner**: ${todayMenu.dinner}\n\n` +
            `*Catering Service: ${messData?.provider || 'Annapurna Catering Services'}*`;
        } else {
          reply = `Mess menu details are currently being updated by the catering committee. Please check the **Mess Services** section.`;
        }
      } catch (err) {
        reply = `Today's Mess Menu (Kalpana Chawla Hall):\n- **Breakfast**: Puri, Ghuguni, Tea/Coffee\n- **Lunch**: Rice, Dalma, Saga Bhaja, Mushroom Curry\n- **Snacks**: Vada, Tea\n- **Dinner**: Roti, Chicken Curry / Kadai Paneer, Rice`;
      }
    } else if (lower.includes('notice') || lower.includes('announcement')) {
      if (relevantNotices.length > 0) {
        reply = `Here are the top notices relevant to you:\n\n` +
          relevantNotices.slice(0, 3).map(n => `- **[${n.category || 'General'}]** ${n.title} (${n.date || 'Today'})`).join('\n');
      } else {
        reply = `There are currently no active notices targeted to your department or role in the database.`;
      }
    } else if (lower.includes('fee') || lower.includes('dues') || lower.includes('payment')) {
      reply = `**Fee Governance Summary for ${user.name}:**\n- Total Amount: ₹${fees.totalAmount || 0}\n- Paid: ₹${fees.paidAmount || 0}\n- Outstanding Due: ₹${fees.dueAmount || 0}`;
    } else if (lower.includes('request') || lower.includes('leave') || lower.includes('gate pass')) {
      reply = `You have submitted **${requests.length} requests** in total. Currently, **${pendingRequests.length} requests** are pending approval from campus administration.`;
    } else if (lower.includes('complaint') || lower.includes('hostel')) {
      reply = `Your profile is linked to **${user.hostel || 'Hostel'} (${user.roomNo || 'Room'})**. You have **${complaints.length} registered grievances** (${pendingComplaints.length} under review).`;
    }

    res.json({ reply, response: reply, source: 'campus-context-engine' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'CampusAI encountered an error processing your request.' });
  }
});

export default router;
