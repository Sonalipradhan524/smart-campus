/**
 * Server-Side Transparent Keyword-Based Complaint Triaging Helper
 */

export const CATEGORY_DEFINITIONS = [
  {
    category: 'Plumbing',
    keywords: [
      'water', 'leakage', 'leak', 'leaking', 'pipe', 'pipes', 'tap', 'taps', 'faucet',
      'bathroom', 'washroom', 'basin', 'sink', 'flush', 'drain', 'drainage', 'sewage',
      'shower', 'pipeline', 'overflow', 'tank', 'clogged', 'plumber'
    ],
    targetDept: 'Estate Plumbing & Water Supply Cell',
    estimatedResolution: '2 - 4 Hours',
    defaultPriority: 'High',
  },
  {
    category: 'Electrical',
    keywords: [
      'light', 'lights', 'fan', 'fans', 'switch', 'switches', 'electricity', 'power',
      'wire', 'wires', 'wiring', 'fuse', 'socket', 'sockets', 'plug', 'bulb', 'bulbs',
      'tube', 'tubelight', 'ac', 'air conditioner', 'cooler', 'geyser', 'short circuit',
      'mcb', 'board', 'voltage', 'spark', 'blackout', 'electrician'
    ],
    targetDept: 'Estate Electrical Cell',
    estimatedResolution: '2 - 4 Hours',
    defaultPriority: 'Medium',
  },
  {
    category: 'Cleaning',
    keywords: [
      'clean', 'cleaning', 'garbage', 'dust', 'toilet', 'toilets', 'sweep', 'sweeper',
      'trash', 'bin', 'waste', 'smell', 'stink', 'dirty', 'hygiene', 'mop', 'litter',
      'corridor', 'dustbin', 'sanitation'
    ],
    targetDept: 'Sanitation & Housekeeping Dept',
    estimatedResolution: '2 Hours',
    defaultPriority: 'Medium',
  },
  {
    category: 'Hostel',
    keywords: [
      'room', 'bed', 'cot', 'mattress', 'warden', 'door', 'doors', 'lock', 'locks',
      'key', 'keys', 'almirah', 'cupboard', 'window', 'mesh', 'hostel', 'curtain',
      'roommate', 'block', 'hostel fee', 'allotment', 'caretaker'
    ],
    targetDept: 'Hostel Administration & Warden Office',
    estimatedResolution: '12 - 24 Hours',
    defaultPriority: 'Medium',
  },
  {
    category: 'Classroom',
    keywords: [
      'projector', 'blackboard', 'whiteboard', 'desk', 'desks', 'bench', 'benches',
      'speaker', 'podium', 'mic', 'microphone', 'lecture', 'hall', 'auditorium',
      'chalk', 'marker', 'duster', 'classroom', 'audio'
    ],
    targetDept: 'Academic Facilities & Estate Dept',
    estimatedResolution: '6 - 12 Hours',
    defaultPriority: 'Medium',
  },
  {
    category: 'Laboratory',
    keywords: [
      'equipment', 'pc', 'computer', 'monitor', 'cpu', 'mouse', 'keyboard', 'lab',
      'laboratory', 'instrument', 'chemical', 'apparatus', 'oscilloscope', 'multimeter',
      'trainer kit', 'experiment', 'hardware', 'software', 'desktop'
    ],
    targetDept: 'Central Computing & Lab Maintenance Cell',
    estimatedResolution: '12 - 24 Hours',
    defaultPriority: 'Medium',
  },
  {
    category: 'Wi-Fi / Internet',
    keywords: [
      'wifi', 'wi-fi', 'internet', 'network', 'connection', 'router', 'ethernet', 'lan',
      'signal', 'hotspot', 'broadband', 'speed', 'disconnect', 'disconnected', 'ip',
      'slow net', 'bandwidth', 'portal', 'dns', 'gateway'
    ],
    targetDept: 'Computer Center IT & Network Cell',
    estimatedResolution: '4 - 8 Hours',
    defaultPriority: 'High',
  },
  {
    category: 'Security',
    keywords: [
      'security', 'gate', 'theft', 'visitor', 'guard', 'guards', 'cctv', 'camera',
      'lost', 'stolen', 'harassment', 'fight', 'trespass', 'id card', 'vehicle pass',
      'night pass', 'entry', 'stranger', 'suspicious'
    ],
    targetDept: 'Campus Security & Proctorial Board',
    estimatedResolution: '1 Hour (Urgent)',
    defaultPriority: 'High',
  },
  {
    category: 'Transport',
    keywords: [
      'bus', 'buses', 'driver', 'van', 'shuttle', 'route', 'routes', 'timing',
      'vehicle', 'pickup', 'drop', 'transport', 'fare', 'seat', 'transportation'
    ],
    targetDept: 'Transport & Fleet Dept',
    estimatedResolution: '12 Hours',
    defaultPriority: 'Medium',
  },
  {
    category: 'Food / Canteen',
    keywords: [
      'food', 'meal', 'meals', 'breakfast', 'lunch', 'dinner', 'snacks', 'canteen',
      'mess', 'taste', 'quality', 'raw', 'spicy', 'stale', 'insect', 'cook',
      'caterer', 'serving', 'dining', 'diet', 'menu', 'roti', 'rice', 'dal'
    ],
    targetDept: 'Mess & Canteen Management Committee',
    estimatedResolution: '4 Hours',
    defaultPriority: 'High',
  },
];

const URGENCY_KEYWORDS = [
  'urgent', 'emergency', 'hazard', 'danger', 'dangerous', 'shock', 'fire',
  'spark', 'burst', 'overflowing', 'theft', 'stolen', 'harassment', 'broken',
  'critical', 'immediately', 'severe'
];

export const serverTriageComplaint = (title = '', description = '', userCategory = '') => {
  const combinedText = `${title} ${description}`.toLowerCase();
  
  if (!combinedText.trim()) {
    return {
      category: userCategory || 'Other',
      targetDept: 'Campus Administrator',
      priority: 'Medium',
      estimatedResolution: '24 - 48 Hours',
      matchedKeywords: [],
      routingLogic: 'Manual Category Selection',
    };
  }

  let bestMatch = null;
  let highestScore = 0;
  let matchedKeywordsList = [];

  for (const def of CATEGORY_DEFINITIONS) {
    const matched = def.keywords.filter((kw) => {
      const regex = new RegExp(`\\b${kw}`, 'i');
      return regex.test(combinedText);
    });

    if (matched.length > highestScore) {
      highestScore = matched.length;
      bestMatch = def;
      matchedKeywordsList = matched;
    }
  }

  const hasUrgency = URGENCY_KEYWORDS.some((ukw) => combinedText.includes(ukw));

  if (bestMatch && highestScore > 0) {
    const calculatedPriority = hasUrgency ? 'High' : bestMatch.defaultPriority;
    return {
      category: bestMatch.category,
      targetDept: bestMatch.targetDept,
      priority: calculatedPriority,
      estimatedResolution: bestMatch.estimatedResolution,
      matchedKeywords: matchedKeywordsList,
      routingLogic: `Keyword Triaged (${matchedKeywordsList.slice(0, 3).join(', ')})`,
    };
  }

  const matchingFallback = CATEGORY_DEFINITIONS.find(c => c.category === userCategory);
  return {
    category: userCategory || 'Other',
    targetDept: matchingFallback ? matchingFallback.targetDept : 'Campus Administrator',
    priority: hasUrgency ? 'High' : 'Medium',
    estimatedResolution: matchingFallback ? matchingFallback.estimatedResolution : '24 - 48 Hours',
    matchedKeywords: [],
    routingLogic: 'General Campus Administrator Review',
  };
};
