import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { ENV } from "./env.js";

export const pool = mysql.createPool({
  host: ENV.MYSQL_HOST,
  port: ENV.MYSQL_PORT,
  user: ENV.MYSQL_USER,
  password: ENV.MYSQL_PASSWORD,
  database: ENV.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function initDatabase(): Promise<void> {
  try {
    const conn = await pool.getConnection();
    console.log(`[MySQL] Successfully connected to database "${ENV.MYSQL_DATABASE}" on ${ENV.MYSQL_HOST}:${ENV.MYSQL_PORT}`);

    // Create DDL tables if they do not exist
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(36) PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        index_label VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255) NOT NULL,
        summary TEXT NOT NULL,
        highlights JSON NOT NULL,
        stack JSON NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        image_alt VARCHAR(255) NOT NULL,
        live_url VARCHAR(500) NULL,
        github_url VARCHAR(500) NOT NULL,
        status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'published',
        featured BOOLEAN NOT NULL DEFAULT FALSE,
        year VARCHAR(20) DEFAULT '2026',
        sort_order INT NOT NULL DEFAULT 0,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL DEFAULT 'Portfolio Contact',
        message TEXT NOT NULL,
        status ENUM('unread', 'read', 'archived') NOT NULL DEFAULT 'unread',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS resume_documents (
        id VARCHAR(36) PRIMARY KEY,
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_url VARCHAR(500) NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT FALSE,
        version VARCHAR(50) DEFAULT 'v1.0',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id VARCHAR(36) PRIMARY KEY,
        event_name VARCHAR(100) NOT NULL,
        page_path VARCHAR(255) NOT NULL DEFAULT '/',
        project_id VARCHAR(255) NULL,
        metadata JSON NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ensure default admin user exists
    const [users] = await conn.query<mysql.RowDataPacket[]>("SELECT id FROM users WHERE email = ?", ["admin@example.com"]);
    if (users.length === 0) {
      const hash = await bcrypt.hash("admin123", 10);
      await conn.query("INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)", [
        "admin-user-id-001",
        "admin@example.com",
        hash,
        "admin",
      ]);
      console.log("[MySQL] Default Admin user initialized (email: admin@example.com, pass: admin123)");
    }

    // Seed initial flagship projects if table is empty
    const [projectsCount] = await conn.query<mysql.RowDataPacket[]>("SELECT COUNT(*) as count FROM projects");
    if (projectsCount[0]?.count === 0) {
      const seedProjects = [
        ["medconnect-uuid", "medconnect", "001", "MedConnect", "Full-Stack Healthcare Management Platform", "A healthcare management platform covering appointment booking, patient records, health vitals monitoring and telemedicine workflows.", JSON.stringify(["Role-based authentication with separate dashboards for patients, doctors and administrators.", "Appointment management, availability scheduling and patient history access.", "Express.js APIs and MongoDB data management behind a responsive frontend."]), JSON.stringify(["React", "Vite", "TypeScript", "Tailwind CSS", "Express.js", "MongoDB"]), "/src/assets/project-medconnect.jpg", "MedConnect dashboard with appointments, patient vitals and doctor list", "https://medconnect-8x1l.onrender.com", "https://github.com/abhijit5996/MedConnect", "published", true, 1],
        ["fiteats-uuid", "fiteats", "002", "FitEats", "Food Ordering & Recommendation Platform", "A full-stack food ordering application featuring a personalized recommendation engine to enhance user engagement.", JSON.stringify(["Developed and deployed the full-stack ordering application on Render.", "Personalized recommendation engine integrated into the ordering flow."]), JSON.stringify(["React.js", "Node.js", "Express.js", "MongoDB"]), "/src/assets/project-fiteats.jpg", "FitEats meal ordering interface with nutrition summary", "https://final-nutriorder.onrender.com", "https://github.com/abhijit5996/FitEats-Food-Recommendation-and-Delivery-Partner", "published", true, 2],
        ["recsys-uuid", "recommendation-system", "003", "Intelligent Recommendation System", "ML-Based Suggestion Engine", "A machine-learning recommendation engine using content-based filtering to provide tailored user suggestions.", JSON.stringify(["Engineered a recommendation engine using content-based filtering techniques."]), JSON.stringify(["Python", "Pandas", "NumPy", "Streamlit", "Machine Learning"]), "/src/assets/project-recsys.jpg", "Streamlit recommendation dashboard with similarity scores", null, "https://github.com/abhijit5996/Python-Project-Recommendation-System", "published", false, 3],
        ["pathfinder-uuid", "pathfinder", "004", "PathFinder", "Travelling Salesman Problem Visualization Tool", "An interactive algorithm visualization tool that computes and maps optimal routes across complex multi-node networks.", JSON.stringify(["Interactive visualization of route optimization and TSP concepts."]), JSON.stringify(["React.js", "JavaScript", "Algorithm Visualization"]), "/src/assets/project-pathfinder.jpg", "Route optimization visualizer with nodes and optimal path", null, "https://github.com/abhijit5996/pathfinder-pro", "published", false, 4],
        ["transithub-uuid", "transithub", "005", "TransitHub", "Last-Mile Transit Solution", "A scalable transit platform focused on last-mile transportation.", JSON.stringify(["Architected with TypeScript for type-safe components, improving maintainability and reducing runtime errors."]), JSON.stringify(["React", "TypeScript", "Tailwind CSS"]), "/src/assets/project-transithub.jpg", "Transit platform with routes, live map and schedules", null, "https://github.com/abhijit5996/Transit-Hub", "published", false, 5],
        ["khet-uuid", "khet-se-ghar-tak", "006", "Khet-se-ghar-tak", "Farm-to-Table E-Commerce Platform", "A responsive farm-to-consumer e-commerce platform designed to facilitate direct farmer-to-consumer transactions.", JSON.stringify(["Engineered to streamline the supply chain between farmers and consumers."]), JSON.stringify(["React", "TypeScript", "Tailwind CSS"]), "/src/assets/project-khetseghartak.jpg", "Farm-to-table e-commerce storefront with produce and farmer profiles", null, "https://github.com/abhijit5996/grocer-roots-link", "published", false, 6],
      ];

      for (const p of seedProjects) {
        await conn.query(`
          INSERT INTO projects (id, slug, index_label, title, subtitle, summary, highlights, stack, image_url, image_alt, live_url, github_url, status, featured, sort_order)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, p);
      }
      console.log("[MySQL] Initial flagship projects seeded successfully.");
    }

    conn.release();
  } catch (err) {
    console.warn("[MySQL] Warning: Could not connect to MySQL server. Operating in database mode:", (err as Error).message);
  }
}
