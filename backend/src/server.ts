import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import patientRoutes from './routes/patientRoutes.js';
import bedRoutes from './routes/bedRoutes.js';
import flowRoutes from './routes/flowRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/patients', patientRoutes);
app.use('/api/beds', bedRoutes);
app.use('/api/flow', flowRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Smart Hospital Bed Allocation & Patient Flow Management System'
  });
});

// Serve frontend static files
const frontendPath = path.join(process.cwd(), 'frontend');
app.use(express.static(frontendPath));

// Route aliases for clean URLs
app.get('/patients', (req: Request, res: Response) => {
  res.sendFile(path.join(frontendPath, 'patients.html'));
});

app.get('/beds', (req: Request, res: Response) => {
  res.sendFile(path.join(frontendPath, 'beds.html'));
});

app.get('/patient-flow', (req: Request, res: Response) => {
  res.sendFile(path.join(frontendPath, 'patient-flow.html'));
});

// Fallback to index.html for dashboard
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Unhandled Application Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

export const server = app.listen(PORT, () => {
  console.log(`========================================================`);
  console.log(`🏥 Smart Hospital Bed Allocation & Patient Flow System`);
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log(`📊 Dashboard:         http://localhost:${PORT}/index.html`);
  console.log(`👥 Patients:          http://localhost:${PORT}/patients.html`);
  console.log(`🛏️  Bed Allocation:    http://localhost:${PORT}/beds.html`);
  console.log(`🔄 Patient Flow:      http://localhost:${PORT}/patient-flow.html`);
  console.log(`========================================================`);
}).on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Error: Port ${PORT} is already in use.`);
    console.error(`👉 You can free the port or specify another port, for example:`);
    console.error(`   PowerShell: $env:PORT=3001; npm start`);
    console.error(`   CMD:        set PORT=3001 && npm start\n`);
  } else {
    console.error('Server error:', err);
  }
});

export default app;
