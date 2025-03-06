# Hospital Intelligence Platform

A comprehensive healthcare analytics platform that provides insights into hospital performance, claims analysis, and impact assessment.

## Features

- Hospital Impact Analysis
- Claims Analysis
- Performance Metrics
- Interactive Dashboards
- Real-time Data Processing

## Tech Stack

- Frontend: React.js with Vite
- Backend: FastAPI (Python)
- Data Processing: Pandas, NumPy
- Deployment: Vercel

## Project Structure

```
Hospital Intelligence/
├── Backend/
│   ├── main.py
│   ├── utils.py
│   └── hospital_data_v1.xlsx
└── Frontend/
    └── HospIntel/
        ├── src/
        ├── public/
        └── package.json
```

## Setup Instructions

### Backend Setup

1. Create a virtual environment:
```bash
cd Backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the backend server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 5002
```

### Frontend Setup

1. Install dependencies:
```bash
cd Frontend/HospIntel
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Deployment

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy the frontend:
```bash
cd Frontend/HospIntel
vercel
```

3. Deploy the backend:
```bash
cd Backend
vercel
```

## Environment Variables

Create a `.env` file in the Backend directory:

```
PORT=5002
HOST=0.0.0.0
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License 