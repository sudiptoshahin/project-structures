### Terminal 1 - Backend
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python manage.py runserver
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/users/
- Admin Panel: http://localhost:8000/admin

## Onion Architecture Explanation

**Domain Layer** (Core): Contains business entities and repository interfaces. No dependencies on other layers.

**Application Layer**: Contains use cases and business logic orchestration. Depends only on Domain layer.

**Infrastructure Layer**: Contains concrete implementations (Django ORM). Depends on Domain layer.

**Presentation Layer**: Contains API views and serializers (DRF). Depends on Application and Infrastructure layers.

The dependency rule: inner layers don't know about outer layers. This makes the code testable, maintainable, and framework-independent.