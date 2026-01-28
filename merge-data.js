const fs = require('fs');
const path = require('path');

const tasksFile = path.join(__dirname, 'tasks.json');
const statsFile = path.join(__dirname, 'statistics.json');
const dbFile = path.join(__dirname, 'db.json');

const tasksData = JSON.parse(fs.readFileSync(tasksFile, 'utf8'));
const statsData = JSON.parse(fs.readFileSync(statsFile, 'utf8'));

const db = {
  tasks: tasksData.tasks,
  meta: tasksData.meta,
  statistics: statsData.statistics,
  statsLastUpdated: statsData.lastUpdated,
};

fs.writeFileSync(dbFile, JSON.stringify(db, null, 2), 'utf8');
console.log('db.json created successfully.');
