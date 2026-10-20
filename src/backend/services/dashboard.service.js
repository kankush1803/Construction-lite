const projectService = require('./project.service');
const equipmentService = require('./equipment.service');
const manpowerService = require('./manpower.service');
const safetyService = require('./safety.service');
const alertService = require('./alert.service');

const dashboardService = {
  async getSummary() {
    const [projects, equipment, manpower, safety, alerts] = await Promise.all([
      projectService.getAllProjects(),
      equipmentService.getSummary(),
      manpowerService.getSummary(),
      safetyService.getOverview(),
      alertService.getAllAlerts(),
    ]);

    const activeProjects = projects.filter((p) => p.status === 'In Progress').length;
    const avgProgress = projects.length
      ? Math.round(projects.reduce((acc, p) => acc + parseFloat(p.progress || 0), 0) / projects.length)
      : 0;

    const criticalAlerts = alerts.filter((a) => a.severity === 'Critical' && a.status === 'Open').length;

    return {
      stats: {
        activeProjects,
        totalProjects: projects.length,
        averageProgress: avgProgress,
        equipmentActive: equipment.active,
        equipmentTotal: equipment.total,
        equipmentUtilization: equipment.utilizationRate,
        manpowerOnSite: manpower.onSite,
        manpowerTotal: manpower.total,
        incidentFreeDays: safety.incidentFreeDays,
        criticalAlertsCount: criticalAlerts,
      },
      projects: projects.slice(0, 5),
      equipmentSummary: equipment,
      manpowerSummary: manpower,
      safetyOverview: safety,
      recentAlerts: alerts.slice(0, 6),
      chartData: {
        productivityTrends: [
          { day: 'Mon', planned: 85, actual: 88 },
          { day: 'Tue', planned: 85, actual: 82 },
          { day: 'Wed', planned: 88, actual: 91 },
          { day: 'Thu', planned: 90, actual: 89 },
          { day: 'Fri', planned: 90, actual: 94 },
          { day: 'Sat', planned: 75, actual: 78 },
        ],
        equipmentUsage: [
          { name: 'Excavators', operating: 38, idle: 6 },
          { name: 'Cranes', operating: 45, idle: 3 },
          { name: 'Bulldozers', operating: 22, idle: 12 },
          { name: 'Dump Trucks', operating: 52, idle: 8 },
          { name: 'Mixers', operating: 31, idle: 4 },
        ],
      },
    };
  },
};

module.exports = dashboardService;
