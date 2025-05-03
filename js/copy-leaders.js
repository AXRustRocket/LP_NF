// Copy-Leaders.js - Handle leader data fetching and table rendering
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the leader board
  initLeaderBoard();
});

async function initLeaderBoard() {
  const leaderTableContainer = document.getElementById('leaderTableBody');
  
  if (!leaderTableContainer) return;
  
  try {
    // Try to fetch from API first
    const leaders = await fetchLeaderData();
    renderLeaderTable(leaders, leaderTableContainer);
  } catch (error) {
    console.error('Error loading leader data:', error);
    // Fallback to demo data if API fetch fails
    renderLeaderTable(getDemoLeaderData(), leaderTableContainer);
  }
}

async function fetchLeaderData() {
  try {
    // Attempt to fetch from the API endpoint
    const response = await fetch('/signals/copy-leaders.json');
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data.leaders || [];
  } catch (error) {
    console.warn('Could not fetch leader data from API:', error);
    throw error;
  }
}

function getDemoLeaderData() {
  // Fallback demo data if API is not available
  return [
    {
      id: "leader1",
      name: "SOL_Degen",
      avatar: "/assets/copy/leader-avatar1.svg",
      roi_30d: 187.4,
      roi_7d: 42.3,
      followers: 312,
      risk_level: "High",
      trades_count: 78,
      win_rate: 68
    },
    {
      id: "leader2",
      name: "MemeHunter",
      avatar: "/assets/copy/leader-avatar2.svg",
      roi_30d: 143.2,
      roi_7d: 23.7,
      followers: 278,
      risk_level: "Medium",
      trades_count: 54,
      win_rate: 72
    },
    {
      id: "leader3",
      name: "Rocket_Chef",
      avatar: "/assets/copy/leader-avatar3.svg",
      roi_30d: 92.8,
      roi_7d: 18.5,
      followers: 195,
      risk_level: "Medium",
      trades_count: 41,
      win_rate: 65
    },
    {
      id: "leader4",
      name: "WifHunter",
      avatar: "/assets/copy/leader-avatar4.svg",
      roi_30d: 78.5,
      roi_7d: 15.2,
      followers: 156,
      risk_level: "Low",
      trades_count: 35,
      win_rate: 80
    },
    {
      id: "leader5",
      name: "SolWhisperer",
      avatar: "/assets/copy/leader-avatar5.svg",
      roi_30d: 65.3,
      roi_7d: 11.9,
      followers: 124,
      risk_level: "Low",
      trades_count: 32,
      win_rate: 75
    }
  ];
}

function renderLeaderTable(leaders, container) {
  // Clear any loading state or previous content
  container.innerHTML = '';
  
  // Sort leaders by 30-day ROI (highest first)
  const sortedLeaders = [...leaders].sort((a, b) => b.roi_30d - a.roi_30d);
  
  // Render top 5 leaders (or fewer if less available)
  const displayLeaders = sortedLeaders.slice(0, 5);
  
  displayLeaders.forEach(leader => {
    const row = document.createElement('tr');
    row.className = 'border-b border-spaceDark/50 hover:bg-spaceDark/30 transition-colors';
    
    const riskColorClass = getRiskColorClass(leader.risk_level);
    
    row.innerHTML = `
      <td class="py-4 pl-4 pr-2">
        <div class="flex items-center gap-3">
          <img src="${leader.avatar}" alt="${leader.name}" class="w-8 h-8 rounded-full">
          <div>
            <div class="font-medium">${leader.name}</div>
            <div class="text-xs text-gray-400">${leader.followers} followers</div>
          </div>
        </div>
      </td>
      <td class="py-4 px-2">
        <div class="font-medium text-neonGreen">+${leader.roi_30d.toFixed(1)}%</div>
        <div class="text-xs text-gray-400">30-day ROI</div>
      </td>
      <td class="py-4 px-2">
        <div class="font-medium text-neonGreen">+${leader.roi_7d.toFixed(1)}%</div>
        <div class="text-xs text-gray-400">7-day ROI</div>
      </td>
      <td class="py-4 px-2">
        <div class="font-medium">${leader.win_rate}%</div>
        <div class="text-xs text-gray-400">${leader.trades_count} trades</div>
      </td>
      <td class="py-4 pl-2 pr-4">
        <span class="px-2 py-1 rounded-full text-xs font-medium ${riskColorClass}">
          ${leader.risk_level}
        </span>
      </td>
    `;
    
    container.appendChild(row);
  });
  
  // If we're using demo data, remove the loading state from the container
  const tableContainer = document.getElementById('leaderTableContainer');
  if (tableContainer) {
    tableContainer.classList.remove('animate-pulse');
  }
}

function getRiskColorClass(riskLevel) {
  switch(riskLevel.toLowerCase()) {
    case 'high':
      return 'bg-liechtensteinRed/20 text-liechtensteinRed border border-liechtensteinRed/30';
    case 'medium':
      return 'bg-speedYellow/20 text-speedYellow border border-speedYellow/30';
    case 'low':
      return 'bg-neonGreen/20 text-neonGreen border border-neonGreen/30';
    default:
      return 'bg-gray-200/20 text-gray-200 border border-gray-200/30';
  }
} 