const manpowerRepository = require('../repositories/manpower.repository');

const manpowerService = {
  async getAllWorkers(projectId = null) {
    return manpowerRepository.findAll(projectId);
  },

  async getSummary() {
    const workers = await manpowerRepository.findAll();
    const onSite = workers.filter((w) => w.status === 'On Site').length;
    const onBreak = workers.filter((w) => w.status === 'On Break').length;
    const offSite = workers.filter((w) => w.status === 'Off Site').length;
    const certified = workers.filter((w) => w.safety_certified).length;

    const tradeBreakdown = workers.reduce((acc, w) => {
      acc[w.trade] = (acc[w.trade] || 0) + 1;
      return acc;
    }, {});

    return {
      total: workers.length,
      onSite,
      onBreak,
      offSite,
      attendanceRate: workers.length ? Math.round(((onSite + onBreak) / workers.length) * 100) : 0,
      safetyCertifiedRate: workers.length ? Math.round((certified / workers.length) * 100) : 100,
      trades: Object.keys(tradeBreakdown).map((trade) => ({
        trade,
        count: tradeBreakdown[trade],
      })),
    };
  },
};

module.exports = manpowerService;
