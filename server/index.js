import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const allowedOrigins = ["https://spinwheel.novacodex.in","http://localhost:5173"];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());

// MySQL connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'professor_spin'
};

// Initialize database
async function initDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });

    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await connection.end();

    const db = await mysql.createConnection(dbConfig);

    // Create staff table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS staff (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        department VARCHAR(255) NOT NULL,
        favorite_thing_1 VARCHAR(255) NOT NULL,
        favorite_thing_2 VARCHAR(255) NOT NULL,
        favorite_thing_3 VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create spin_results table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS spin_results (
        id INT PRIMARY KEY AUTO_INCREMENT,
        staff_id INT,
        actor_name VARCHAR(255) NOT NULL,
        ai_quote TEXT NOT NULL,
        spun_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (staff_id) REFERENCES staff(id)
      )
    `);

    await db.end();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Get database connection
async function getConnection() {
  return await mysql.createConnection(dbConfig);
}

// Routes
app.post('/api/staff/register', async (req, res) => {
  try {
    const { name, department, favoriteThings } = req.body;
    const connection = await getConnection();
    
    const [result] = await connection.execute(
      'INSERT INTO staff (name, department, favorite_thing_1, favorite_thing_2, favorite_thing_3) VALUES (?, ?, ?, ?, ?)',
      [name, department, favoriteThings[0], favoriteThings[1], favoriteThings[2]]
    );
    
    await connection.end();
    res.json({ success: true, staffId: result.insertId });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  if (username === adminUsername && password === adminPassword) {
    res.json({ success: true, token: 'admin-token' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/staff', async (req, res) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(`
      SELECT s.*, 
             CASE WHEN sr.staff_id IS NOT NULL THEN 'completed' ELSE 'pending' END as status,
             COUNT(sr.id) as spin_count
      FROM staff s
      LEFT JOIN spin_results sr ON s.id = sr.staff_id
      GROUP BY s.id
      ORDER BY s.created_at DESC
    `);
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
});

app.get('/api/analytics', async (req, res) => {
  try {
    const connection = await getConnection();
    
    const [totalStaff] = await connection.execute('SELECT COUNT(*) as count FROM staff');
    const [completedStaff] = await connection.execute('SELECT COUNT(DISTINCT staff_id) as count FROM spin_results');
    const [totalSpins] = await connection.execute('SELECT COUNT(*) as count FROM spin_results');
    
    await connection.end();
    
    const totalCount = totalStaff[0].count;
    const completedCount = completedStaff[0].count;
    
    res.json({
      totalStaff: totalCount,
      pendingStaff: totalCount - completedCount,
      completedStaff: completedCount,
      totalSpins: totalSpins[0].count
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

app.post('/api/spin/result', async (req, res) => {
  try {
    const { staffId, actorName, aiQuote } = req.body;
    const connection = await getConnection();
    
    await connection.execute(
      'INSERT INTO spin_results (staff_id, actor_name, ai_quote) VALUES (?, ?, ?)',
      [staffId, actorName, aiQuote]
    );
    
    await connection.end();
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving spin result:', error);
    res.status(500).json({ error: 'Failed to save result' });
  }
});

app.get('/api/staff/:id/spins', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    
    const [rows] = await connection.execute(
      'SELECT * FROM spin_results WHERE staff_id = ? ORDER BY spun_at DESC',
      [id]
    );
    
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching spin history:', error);
    res.status(500).json({ error: 'Failed to fetch spin history' });
  }
});

app.post('/api/generate-quote', async (req, res) => {
  try {
    const { staffName, department, favoriteThings, actorName } = req.body;
    
//     const prompt = `Generate a short, fun, celebratory thank-you quote for a professor. Use this format:

// Staff Name: ${staffName}
// Department: ${department}
// Favorite Things: ${favoriteThings.join(', ')}
// Actor: ${actorName}

// Create a 2-3 line quote that:
// - Starts with "Dear Professor ${staffName},"
// - Mentions one of their favorite things
// - Connects it to the actor name in a fun way
// - Ends with appreciation for their department work
// - Use appropriate emojis
// - Keep it motivational and joyful

// Example style: "Dear Professor Sarah, Since you love Coffee ☕, today Shah Rukh Khan is raising a toast to you! Thank you for energizing the Computer Science department! 🎉"`;

const prompt = `Generate a heartfelt, blessing-style Teacher’s Day quote in one or two lines.

Format:
- Start with "Dear, ${staffName}"
- Mention one of their favorite things: ${favoriteThings.join(', ')}
- Connect it with ${actorName} in a joyful and inspiring way
- Use blessing/aim/destination style: wish them joy, guidance, light, inspiration
- Appreciate their contribution to the ${department} department
- End with "Happy Teacher’s Day 🎉"
- Add positive emojis like 🌟🙏✨🌸🎉

Example style:
"Dear, Meena 🌸 Since you love Coffee ☕, Rajinikanth says your energy blesses every student’s journey towards success 🌟🙏 Thank you for guiding the Computer Science department. Happy Teacher’s Day 🎉"

"Dear, Arjun ✨ Since you love Gardening 🌱, Sridevi says you nurture every student’s path with blessings and wisdom, helping them bloom towards their dreams 🌸🙏 Thank you for inspiring the Mathematics department. Happy Teacher’s Day 🎉"`;



    const apiKey = process.env.GEMINI_API_KEY;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 200
        }
      })
    });

    const data = await response.json();
    const quote = data.candidates[0].content.parts[0].text.trim();
    
    res.json({ quote });
  } catch (error) {
    console.error('AI quote generation error:', error);
    res.status(500).json({ error: 'Failed to generate quote' });
  }
});

// Initialize database and start server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});