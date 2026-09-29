const fs = require('fs');
const path = require('path');
const readline = require('readline');
const mongoose = require('mongoose');
const JobSignal = require('./models/JobSignal');
const connectDB = require('./config/db');

const seedJobSignals = async () => {
  try {
    await connectDB();
    const count = await JobSignal.countDocuments();
    console.log(`[SeedSignals] Current JobSignals count: ${count}`);

    if (count >= 10000) {
      console.log('[SeedSignals] JobSignals already populated with 10,000+ records. Skipping.');
      return;
    }

    const csvPath = path.join(__dirname, '../../dataset/labour_market_signals_10k.csv');
    if (!fs.existsSync(csvPath)) {
      console.warn(`[SeedSignals] CSV not found at ${csvPath}`);
      return;
    }

    console.log('[SeedSignals] Loading 10,500 records from CSV into MongoDB...');
    const fileStream = fs.createReadStream(csvPath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    let isHeader = true;
    let records = [];
    let totalInserted = 0;

    for await (const line of rl) {
      if (isHeader) {
        isHeader = false;
        continue;
      }
      if (!line.trim()) continue;

      // Simple CSV line parser handling basic values
      // signal_id,job_title,company,sector,location_district,state,required_skills,primary_skill,skills_count,nsqf_proficiency_level,hiring_volume,avg_salary_lpa,urgency,growth_trend_pct,is_obsolete_role,data_source,posted_date
      const parts = line.split(',');
      if (parts.length >= 16) {
        const signalId = parts[0];
        const jobTitle = parts[1];
        const company = parts[2];
        const sector = parts[3];
        const locationDistrict = parts[4];
        const state = parts[5];
        // skills might contain semicolon
        const requiredSkillsStr = parts[6] || '';
        const requiredSkills = requiredSkillsStr.split(';').map(s => s.trim()).filter(Boolean);
        const primarySkill = parts[7] || (requiredSkills[0] || 'Technical Skills');
        const skillsCount = parseInt(parts[8], 10) || requiredSkills.length || 3;
        const nsqfProficiencyLevel = parseInt(parts[9], 10) || 4;
        const hiringVolume = parseInt(parts[10], 10) || 10;
        const avgSalaryLPA = parseFloat(parts[11]) || 4.5;
        const urgency = parts[12] || 'High';
        const growthTrendPct = parseFloat(parts[13]) || 12.0;
        const isObsoleteRole = parts[14] === '1' || parts[14] === 'true';
        const source = parts[15] || 'LinkedIn';
        const postedDate = parts[16] ? new Date(parts[16]) : new Date();

        records.push({
          signalId,
          jobTitle,
          company,
          sector,
          locationDistrict,
          state,
          requiredSkills,
          primarySkill,
          skillsCount,
          nsqfProficiencyLevel,
          hiringVolume,
          avgSalaryLPA,
          source,
          urgency,
          growthTrendPct,
          isObsoleteRole,
          postedDate
        });

        if (records.length >= 2500) {
          await JobSignal.insertMany(records, { ordered: false });
          totalInserted += records.length;
          console.log(`[SeedSignals] Inserted batch: ${totalInserted} / 10,500`);
          records = [];
        }
      }
    }

    if (records.length > 0) {
      await JobSignal.insertMany(records, { ordered: false });
      totalInserted += records.length;
      console.log(`[SeedSignals] Inserted final batch: ${totalInserted}`);
    }

    const finalCount = await JobSignal.countDocuments();
    console.log(`[SeedSignals] Successfully populated MongoDB! Total records: ${finalCount}`);
  } catch (err) {
    console.error('[SeedSignals Error]:', err.message);
  }
};

if (require.main === module) {
  seedJobSignals().then(() => process.exit(0));
}

module.exports = seedJobSignals;
