// Global state and data
let currentSection = 'home';
let selectedModel = 'arima';
let selectedSeverity = 3;
let map = null;
let citizenMap = null;
let charts = {};

// Application data
const appData = {
  monitoring_stations: [
    {"id": 1, "name": "Anand Vihar", "lat": 28.6469, "lng": 77.3162, "aqi": 287, "pm25": 142, "pm10": 195, "status": "Poor"},
    {"id": 2, "name": "ITO", "lat": 28.6281, "lng": 77.2420, "aqi": 245, "pm25": 118, "pm10": 178, "status": "Poor"},
    {"id": 3, "name": "Dwarka", "lat": 28.5921, "lng": 77.0460, "aqi": 198, "pm25": 89, "pm10": 145, "status": "Moderate"},
    {"id": 4, "name": "Rohini", "lat": 28.7041, "lng": 77.1025, "aqi": 234, "pm25": 105, "pm10": 167, "status": "Poor"},
    {"id": 5, "name": "Punjabi Bagh", "lat": 28.6692, "lng": 77.1314, "aqi": 221, "pm25": 98, "pm10": 158, "status": "Poor"},
    {"id": 6, "name": "Mandir Marg", "lat": 28.6375, "lng": 77.2011, "aqi": 203, "pm25": 91, "pm10": 149, "status": "Poor"},
    {"id": 7, "name": "RK Puram", "lat": 28.5630, "lng": 77.1847, "aqi": 189, "pm25": 82, "pm10": 138, "status": "Moderate"},
    {"id": 8, "name": "Jahangirpuri", "lat": 28.7297, "lng": 77.1636, "aqi": 267, "pm25": 128, "pm10": 185, "status": "Poor"},
    {"id": 9, "name": "Faridabad", "lat": 28.4089, "lng": 77.3178, "aqi": 278, "pm25": 135, "pm10": 189, "status": "Poor"},
    {"id": 10, "name": "Ghaziabad", "lat": 28.6692, "lng": 77.4538, "aqi": 262, "pm25": 124, "pm10": 181, "status": "Poor"},
    {"id": 11, "name": "Greater Noida", "lat": 28.4744, "lng": 77.5040, "aqi": 260, "pm25": 122, "pm10": 179, "status": "Poor"},
    {"id": 12, "name": "Gurugram", "lat": 28.4595, "lng": 77.0266, "aqi": 243, "pm25": 115, "pm10": 173, "status": "Poor"}
  ],
  pollution_sources: {
    vehicular: 47,
    road_dust: 20,
    stubble_burning: 15,
    industrial: 10,
    construction: 5,
    others: 3
  },
  aqi_categories: {
    good: {min: 0, max: 50, color: "#10B981", label: "Good"},
    satisfactory: {min: 51, max: 100, color: "#84CC16", label: "Satisfactory"},
    moderate: {min: 101, max: 200, color: "#F59E0B", label: "Moderate"},
    poor: {min: 201, max: 300, color: "#EF4444", label: "Poor"},
    very_poor: {min: 301, max: 400, color: "#991B1B", label: "Very Poor"},
    severe: {min: 401, max: 500, color: "#7C2D12", label: "Severe"}
  },
  historical_data: [
    {date: "2024-09-19", aqi: 189, pm25: 78, pm10: 142},
    {date: "2024-09-20", aqi: 203, pm25: 85, pm10: 156},
    {date: "2024-09-21", aqi: 167, pm25: 65, pm10: 129},
    {date: "2024-09-22", aqi: 234, pm25: 98, pm10: 178},
    {date: "2024-09-23", aqi: 245, pm25: 108, pm10: 189},
    {date: "2024-09-24", aqi: 198, pm25: 82, pm10: 151},
    {date: "2024-09-25", aqi: 221, pm25: 92, pm10: 167}
  ],
  forecasting_models: {
    arima: {accuracy: 78.5, description: "Traditional statistical model for time series forecasting"},
    lstm: {accuracy: 84.2, description: "Deep learning model capturing temporal dependencies"},
    cnn_lstm: {accuracy: 87.6, description: "Hybrid model combining spatial and temporal features"}
  },
  citizen_reports: [
    {
      id: 1,
      location: {lat: 28.6519, lng: 77.2315},
      type: "Industrial Smoke",
      severity: 4,
      description: "Heavy smoke from nearby factory",
      timestamp: "2024-09-25T10:30:00Z",
      status: "Under Review"
    },
    {
      id: 2,
      location: {lat: 28.6745, lng: 77.1382},
      type: "Construction Dust",
      severity: 3,
      description: "Excessive dust from construction site",
      timestamp: "2024-09-25T09:15:00Z",
      status: "Verified"
    }
  ]
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  // Set initial active nav button
  updateActiveNavButton('home');
  
  // Initialize theme
  initializeTheme();
  
  // Update real-time data
  updateRealTimeData();
  
  // Set interval for data updates
  setInterval(updateRealTimeData, 30000); // Update every 30 seconds
}

// Navigation functions
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Show selected section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
    targetSection.classList.add('fade-in');
  }
  
  // Update active nav button
  updateActiveNavButton(sectionId);
  
  // Initialize section-specific functionality
  switch(sectionId) {
    case 'dashboard':
      initializeDashboard();
      break;
    case 'forecast':
      initializeForecast();
      break;
    case 'policy':
      initializePolicy();
      break;
    case 'citizen':
      initializeCitizen();
      break;
    case 'admin':
      initializeAdmin();
      break;
  }
  
  currentSection = sectionId;
}

function updateActiveNavButton(sectionId) {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  const activeBtn = document.querySelector(`[data-section="${sectionId}"]`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }
}

// Theme toggle
function toggleTheme() {
  const html = document.documentElement;
  const themeIcon = document.getElementById('theme-icon');
  
  if (html.getAttribute('data-color-scheme') === 'dark') {
    html.setAttribute('data-color-scheme', 'light');
    themeIcon.className = 'fas fa-moon';
  } else {
    html.setAttribute('data-color-scheme', 'dark');
    themeIcon.className = 'fas fa-sun';
  }
}

function initializeTheme() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const html = document.documentElement;
  const themeIcon = document.getElementById('theme-icon');
  
  if (prefersDark) {
    html.setAttribute('data-color-scheme', 'dark');
    themeIcon.className = 'fas fa-sun';
  } else {
    html.setAttribute('data-color-scheme', 'light');
    themeIcon.className = 'fas fa-moon';
  }
}

// Real-time data updates
function updateRealTimeData() {
  // Simulate real-time AQI fluctuations
  const currentTime = new Date();
  const variation = Math.sin(currentTime.getMinutes() / 10) * 15;
  
  appData.monitoring_stations.forEach(station => {
    const baseAqi = station.aqi;
    station.aqi = Math.max(50, Math.round(baseAqi + variation + (Math.random() - 0.5) * 20));
    station.pm25 = Math.round(station.aqi * 0.42);
    station.pm10 = Math.round(station.aqi * 0.72);
    station.status = getAQIStatus(station.aqi);
  });
  
  // Update average AQI
  const avgAqi = Math.round(appData.monitoring_stations.reduce((sum, station) => sum + station.aqi, 0) / appData.monitoring_stations.length);
  const avgPM25 = Math.round(appData.monitoring_stations.reduce((sum, station) => sum + station.pm25, 0) / appData.monitoring_stations.length);
  const avgPM10 = Math.round(appData.monitoring_stations.reduce((sum, station) => sum + station.pm10, 0) / appData.monitoring_stations.length);
  
  // Update UI elements
  updateElement('avg-aqi', avgAqi);
  updateElement('main-aqi', avgAqi);
  updateElement('main-status', getAQIStatus(avgAqi));
  updateElement('pm25-value', `${avgPM25} µg/m³`);
  updateElement('pm10-value', `${avgPM10} µg/m³`);
  
  // Update AQI color
  const aqiColor = getAQIColor(avgAqi);
  const aqiNumber = document.querySelector('.aqi-number');
  const aqiStatus = document.querySelector('.aqi-status');
  if (aqiNumber) aqiNumber.style.color = aqiColor;
  if (aqiStatus) aqiStatus.style.color = aqiColor;
  
  // Update stations if dashboard is active
  if (currentSection === 'dashboard') {
    updateStationsList();
    if (map) updateMapMarkers();
  }
}

function updateElement(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function getAQIStatus(aqi) {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Satisfactory";
  if (aqi <= 200) return "Moderate";
  if (aqi <= 300) return "Poor";
  if (aqi <= 400) return "Very Poor";
  return "Severe";
}

function getAQIColor(aqi) {
  if (aqi <= 50) return "#10B981";
  if (aqi <= 100) return "#84CC16";
  if (aqi <= 200) return "#F59E0B";
  if (aqi <= 300) return "#EF4444";
  if (aqi <= 400) return "#991B1B";
  return "#7C2D12";
}

// Dashboard functions
function initializeDashboard() {
  initializeMap();
  createCharts();
  updateStationsList();
}

function initializeMap() {
  if (map) return; // Map already initialized
  
  map = L.map('map').setView([28.6139, 77.2090], 10);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  
  updateMapMarkers();
}

function updateMapMarkers() {
  if (!map) return;
  
  // Clear existing markers
  map.eachLayer(layer => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });
  
  // Add station markers
  appData.monitoring_stations.forEach(station => {
    const color = getAQIColor(station.aqi);
    
    const marker = L.circleMarker([station.lat, station.lng], {
      radius: 8,
      fillColor: color,
      color: '#fff',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8
    }).addTo(map);
    
    marker.bindPopup(`
      <strong>${station.name}</strong><br>
      AQI: <span style="color: ${color}; font-weight: bold;">${station.aqi}</span><br>
      PM2.5: ${station.pm25} µg/m³<br>
      PM10: ${station.pm10} µg/m³<br>
      Status: ${station.status}
    `);
  });
}

function createCharts() {
  // AQI Trend Chart
  const aqiTrendCtx = document.getElementById('aqiTrendChart');
  if (aqiTrendCtx && !charts.aqiTrend) {
    charts.aqiTrend = new Chart(aqiTrendCtx, {
      type: 'line',
      data: {
        labels: appData.historical_data.map(d => new Date(d.date).toLocaleDateString()),
        datasets: [{
          label: 'AQI',
          data: appData.historical_data.map(d => d.aqi),
          borderColor: '#1FB8CD',
          backgroundColor: 'rgba(31, 184, 205, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'AQI'
            }
          }
        }
      }
    });
  }
  
  // Pollution Source Chart
  const pollutionSourceCtx = document.getElementById('pollutionSourceChart');
  if (pollutionSourceCtx && !charts.pollutionSource) {
    const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545'];
    charts.pollutionSource = new Chart(pollutionSourceCtx, {
      type: 'doughnut',
      data: {
        labels: ['Vehicular', 'Road Dust', 'Stubble Burning', 'Industrial', 'Construction', 'Others'],
        datasets: [{
          data: Object.values(appData.pollution_sources),
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
  
  // Pollutant Comparison Chart
  const pollutantCtx = document.getElementById('pollutantChart');
  if (pollutantCtx && !charts.pollutant) {
    const stations = appData.monitoring_stations.slice(0, 6);
    charts.pollutant = new Chart(pollutantCtx, {
      type: 'bar',
      data: {
        labels: stations.map(s => s.name),
        datasets: [{
          label: 'PM2.5',
          data: stations.map(s => s.pm25),
          backgroundColor: '#1FB8CD'
        }, {
          label: 'PM10',
          data: stations.map(s => s.pm10),
          backgroundColor: '#FFC185'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Concentration (µg/m³)'
            }
          }
        }
      }
    });
  }
}

function updateStationsList() {
  const stationsGrid = document.getElementById('stations-grid');
  if (!stationsGrid) return;
  
  stationsGrid.innerHTML = appData.monitoring_stations.map(station => {
    const color = getAQIColor(station.aqi);
    return `
      <div class="station-card" onclick="focusStation(${station.id})">
        <div class="station-name">${station.name}</div>
        <div class="station-aqi" style="color: ${color}">${station.aqi}</div>
        <div class="station-status" style="color: ${color}">${station.status}</div>
      </div>
    `;
  }).join('');
}

function focusStation(stationId) {
  const station = appData.monitoring_stations.find(s => s.id === stationId);
  if (station && map) {
    map.setView([station.lat, station.lng], 14);
  }
}

// Forecast functions
function initializeForecast() {
  createForecastChart();
  updateScenario();
}

function selectModel(model) {
  selectedModel = model;
  
  // Update active button
  document.querySelectorAll('[data-model]').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-model="${model}"]`).classList.add('active');
  
  runForecast();
}

function updateScenario() {
  const stubbleValue = document.getElementById('stubble-slider').value;
  const vehicleValue = document.getElementById('vehicle-slider').value;
  const industrialValue = document.getElementById('industrial-slider').value;
  
  document.getElementById('stubble-value').textContent = `${stubbleValue}%`;
  document.getElementById('vehicle-value').textContent = `${vehicleValue}%`;
  document.getElementById('industrial-value').textContent = `${industrialValue > 0 ? '+' : ''}${industrialValue}%`;
}

function runForecast() {
  const stubbleReduction = parseInt(document.getElementById('stubble-slider').value);
  const vehicleRestriction = parseInt(document.getElementById('vehicle-slider').value);
  const industrialChange = parseInt(document.getElementById('industrial-slider').value);
  
  // Simulate forecast calculation
  const baseAqi = 245;
  const improvement = (stubbleReduction * 0.3) + (vehicleRestriction * 0.4) - (industrialChange * 0.2);
  const forecastAqi = Math.max(50, Math.round(baseAqi - improvement));
  
  // Generate forecast data
  const forecastData = [];
  for (let i = 0; i < 14; i++) {
    const variation = Math.sin(i * 0.5) * 20 + (Math.random() - 0.5) * 30;
    forecastData.push(Math.max(50, Math.round(forecastAqi + variation)));
  }
  
  // Update forecast chart
  if (charts.forecast) {
    charts.forecast.data.datasets[0].data = forecastData;
    charts.forecast.update();
  }
  
  // Update summary
  const avgForecast = Math.round(forecastData.reduce((a, b) => a + b) / forecastData.length);
  const worstDay = forecastData.indexOf(Math.max(...forecastData)) + 1;
  const improvementValue = baseAqi - avgForecast;
  
  updateElement('avg-forecast', avgForecast);
  updateElement('worst-day', `Day ${worstDay}`);
  updateElement('improvement', `${improvementValue > 0 ? '-' : '+'}${Math.abs(improvementValue)} AQI`);
}

function createForecastChart() {
  const forecastCtx = document.getElementById('forecastChart');
  if (forecastCtx && !charts.forecast) {
    const labels = Array.from({length: 14}, (_, i) => `Day ${i + 1}`);
    const forecastData = Array.from({length: 14}, () => Math.round(245 + (Math.random() - 0.5) * 50));
    
    charts.forecast = new Chart(forecastCtx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Predicted AQI',
          data: forecastData,
          borderColor: '#1FB8CD',
          backgroundColor: 'rgba(31, 184, 205, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            min: 50,
            title: {
              display: true,
              text: 'Predicted AQI'
            }
          }
        }
      }
    });
  }
}

// Policy functions
function initializePolicy() {
  createPolicyChart();
  updatePolicyImpact();
}

function updatePolicyImpact() {
  const oddEven = document.getElementById('odd-even').checked;
  const industrialCurfew = document.getElementById('industrial-curfew').checked;
  const constructionBan = document.getElementById('construction-ban').checked;
  const stubbleBan = document.getElementById('stubble-ban').checked;
  
  let totalReduction = 0;
  const policies = [];
  
  if (oddEven) {
    totalReduction += 17.5; // Average of 15-20%
    policies.push('Odd-Even Vehicle Scheme');
  }
  if (industrialCurfew) {
    totalReduction += 10; // Average of 8-12%
    policies.push('Industrial Curfew');
  }
  if (constructionBan) {
    totalReduction += 6.5; // Average of 5-8%
    policies.push('Construction Ban');
  }
  if (stubbleBan) {
    totalReduction += 30; // Average of 25-35%
    policies.push('Stubble Burning Ban');
  }
  
  const currentAqi = 245;
  const projectedAqi = Math.max(50, Math.round(currentAqi * (1 - totalReduction / 100)));
  
  updateElement('projected-aqi', projectedAqi);
  
  // Update policy chart
  if (charts.policy) {
    const reductionData = [
      oddEven ? 17.5 : 0,
      industrialCurfew ? 10 : 0,
      constructionBan ? 6.5 : 0,
      stubbleBan ? 30 : 0
    ];
    
    charts.policy.data.datasets[0].data = reductionData;
    charts.policy.update();
  }
  
  // Update recommendations
  const recommendationsDiv = document.getElementById('policy-recommendations');
  if (policies.length > 0) {
    recommendationsDiv.innerHTML = `
      <p><strong>Selected Policies:</strong> ${policies.join(', ')}</p>
      <p><strong>Expected AQI Reduction:</strong> ${totalReduction.toFixed(1)}%</p>
      <p><strong>AI Recommendation:</strong> ${getAIRecommendation(policies, totalReduction)}</p>
    `;
  } else {
    recommendationsDiv.innerHTML = '<p>Select policies above to see AI-generated recommendations based on current pollution levels.</p>';
  }
}

function getAIRecommendation(policies, reduction) {
  if (reduction > 40) {
    return "Excellent policy combination. This will significantly improve air quality in Delhi-NCR.";
  } else if (reduction > 25) {
    return "Good policy mix. Consider adding stubble burning controls for maximum impact.";
  } else if (reduction > 10) {
    return "Moderate impact expected. Consider implementing additional measures for better results.";
  } else {
    return "Limited impact. Recommend selecting multiple complementary policies.";
  }
}

function createPolicyChart() {
  const policyCtx = document.getElementById('policyChart');
  if (policyCtx && !charts.policy) {
    charts.policy = new Chart(policyCtx, {
      type: 'bar',
      data: {
        labels: ['Odd-Even', 'Industrial Curfew', 'Construction Ban', 'Stubble Ban'],
        datasets: [{
          label: 'AQI Reduction (%)',
          data: [0, 0, 0, 0],
          backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#5D878F']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 35,
            title: {
              display: true,
              text: 'Reduction Percentage'
            }
          }
        }
      }
    });
  }
}

// Citizen Portal functions
function initializeCitizen() {
  initializeCitizenMap();
  loadCitizenReports();
}

function initializeCitizenMap() {
  if (citizenMap) return; // Map already initialized
  
  citizenMap = L.map('citizen-map').setView([28.6139, 77.2090], 11);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(citizenMap);
  
  // Add citizen reports to map
  appData.citizen_reports.forEach(report => {
    const marker = L.marker([report.location.lat, report.location.lng]).addTo(citizenMap);
    marker.bindPopup(`
      <strong>${report.type}</strong><br>
      Severity: ${report.severity}/5<br>
      Status: ${report.status}<br>
      ${report.description}
    `);
  });
}

function loadCitizenReports() {
  const reportsList = document.getElementById('reports-list');
  if (!reportsList) return;
  
  reportsList.innerHTML = appData.citizen_reports.map(report => `
    <div class="report-item">
      <div class="report-header">
        <div class="report-type">${report.type}</div>
        <div class="report-time">${new Date(report.timestamp).toLocaleDateString()}</div>
      </div>
      <div class="report-description">${report.description}</div>
      <div class="report-status">Status: <span class="status status--${report.status.toLowerCase().replace(' ', '-')}">${report.status}</span></div>
    </div>
  `).join('');
}

function selectSeverity(severity) {
  selectedSeverity = severity;
  
  document.querySelectorAll('.severity-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-severity="${severity}"]`).classList.add('active');
}

function submitReport(event) {
  event.preventDefault();
  
  const location = document.getElementById('report-location').value;
  const type = document.getElementById('report-type').value;
  const description = document.getElementById('report-description').value;
  
  if (!location || !type) {
    alert('Please fill in all required fields.');
    return;
  }
  
  // Simulate report submission
  const newReport = {
    id: appData.citizen_reports.length + 1,
    location: {lat: 28.6139 + (Math.random() - 0.5) * 0.1, lng: 77.2090 + (Math.random() - 0.5) * 0.1},
    type: type,
    severity: selectedSeverity,
    description: description,
    timestamp: new Date().toISOString(),
    status: "Submitted"
  };
  
  appData.citizen_reports.unshift(newReport);
  
  // Reset form
  event.target.reset();
  selectSeverity(3);
  
  // Show success message
  alert('Report submitted successfully! Thank you for helping improve air quality monitoring.');
  
  // Reload reports
  loadCitizenReports();
  
  // Add to map if visible
  if (citizenMap) {
    const marker = L.marker([newReport.location.lat, newReport.location.lng]).addTo(citizenMap);
    marker.bindPopup(`
      <strong>${newReport.type}</strong><br>
      Severity: ${newReport.severity}/5<br>
      Status: ${newReport.status}<br>
      ${newReport.description}
    `);
  }
}

// Admin functions
function initializeAdmin() {
  // Admin panel is initialized through login
}

function adminLogin(event) {
  event.preventDefault();
  
  const username = document.getElementById('admin-username').value;
  const password = document.getElementById('admin-password').value;
  
  // Simple authentication (in real app, this would be server-side)
  if (username === 'admin' && password === 'password123') {
    document.getElementById('admin-login').classList.add('hidden');
    document.getElementById('admin-panel').classList.remove('hidden');
  } else {
    alert('Invalid credentials. Try admin / password123');
  }
}

function adminLogout() {
  document.getElementById('admin-login').classList.remove('hidden');
  document.getElementById('admin-panel').classList.add('hidden');
  
  // Clear form
  document.getElementById('admin-username').value = '';
  document.getElementById('admin-password').value = '';
}

// Utility functions
function generateRandomData(count, min, max) {
  return Array.from({length: count}, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Chart.js default configuration
Chart.defaults.font.family = 'var(--font-family-base)';
Chart.defaults.font.size = 12;
Chart.defaults.color = getComputedStyle(document.documentElement).getPropertyValue('--color-text');

// Handle window resize
window.addEventListener('resize', function() {
  if (map) {
    setTimeout(() => map.invalidateSize(), 100);
  }
  if (citizenMap) {
    setTimeout(() => citizenMap.invalidateSize(), 100);
  }
});

// Export data functions (for admin use)
function exportData(type) {
  let data;
  let filename;
  
  switch(type) {
    case 'stations':
      data = appData.monitoring_stations;
      filename = 'monitoring_stations.json';
      break;
    case 'reports':
      data = appData.citizen_reports;
      filename = 'citizen_reports.json';
      break;
    case 'historical':
      data = appData.historical_data;
      filename = 'historical_data.json';
      break;
    default:
      return;
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}