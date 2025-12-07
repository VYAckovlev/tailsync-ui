# TailSync - Full Project Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [CBL Stage Progress](#cbl-stage-progress)
3. [System Architecture](#system-architecture)
4. [Algorithm Description](#algorithm-description)
5. [Technical Implementation](#technical-implementation)
6. [Data Flow & State Management](#data-flow--state-management)
7. [Component Structure](#component-structure)
8. [API Integration](#api-integration)
9. [Future Improvements](#future-improvements)

---

## Project Overview

### Vision
TailSync is a modern, collaborative calendar management system designed to help users organize their schedules, collaborate with others, and manage various types of events efficiently.

### Core Objectives
- Provide intuitive calendar management with multiple view options
- Enable seamless collaboration through calendar sharing
- Support diverse event types (arrangements, reminders, tasks, holidays)
- Implement recurring events with flexible scheduling
- Ensure secure user authentication and data protection

### Technology Stack
- **Frontend Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.7
- **Routing**: React Router DOM 7.9.5
- **Calendar Library**: FullCalendar 6.1.19
- **HTTP Client**: Axios 1.13.2
- **State Management**: React Context API
- **Styling**: Custom CSS
- **Notifications**: React Hot Toast 2.6.0

---

## CBL Stage Progress

### Stage 1: Engage - Problem Identification
**Duration**: [Your timeframe]
**Challenge**: How can we create an intuitive calendar system that supports collaboration and diverse scheduling needs?

#### Key Questions Identified:
- How do users currently manage their schedules?
- What features are essential for effective calendar collaboration?
- How can we differentiate between different types of events?
- What security measures are needed for shared calendars?

#### Initial Research:
- Analyzed existing calendar applications (Google Calendar, Outlook, etc.)
- Identified common pain points in calendar management
- Defined user personas and use cases
- Established core requirements for the MVP

#### Outcomes:
- Defined project scope and requirements
- Created initial wireframes and user flows
- Established technology stack
- Set up development environment

---

### Stage 2: Investigate - Solution Design & Planning

#### 2.1 Authentication System Design
**Completed**: ✅

**Features Implemented**:
- User registration with email validation
- Secure login system with JWT tokens
- Password reset functionality
- Protected routes for authenticated users
- Token refresh mechanism to maintain sessions

**Decisions Made**:
- Used JWT tokens for stateless authentication
- Implemented token refresh to avoid frequent re-authentication
- Stored tokens securely in localStorage
- Created AuthContext for global authentication state

**Code Reference**:
- `src/context/AuthContext.jsx` - Authentication state management
- `src/services/authApi.js` - Authentication API calls
- `src/utils/AuthService.js` - Token management utilities

---

#### 2.2 Calendar Views Architecture
**Completed**: ✅

**Features Implemented**:
- Day view - detailed hourly schedule
- Week view - 7-day overview with time slots
- Month view - monthly calendar grid
- Year view - annual multi-month display

**Decisions Made**:
- Used FullCalendar library for robust calendar rendering
- Implemented view switching without data reload
- Ensured consistent event display across all views
- Added responsive design for mobile devices

**Code Reference**:
- `src/pages/Calendar/Day/CalendarDay.jsx`
- `src/pages/Calendar/Week/CalendarWeek.jsx`
- `src/pages/Calendar/Month/CalendarMonth.jsx`
- `src/pages/Calendar/Year/CalendarYear.jsx`

---

#### 2.3 Event Management System
**Completed**: ✅

**Features Implemented**:
- Four event types: Arrangements, Reminders, Tasks, Holidays
- Event creation with type-specific forms
- Event editing and deletion
- Event details popover
- Color customization per event type
- Drag-and-drop event rescheduling

**Decisions Made**:
- Created configuration-driven form system for different event types
- Implemented popover-based UI for better UX
- Used color coding to distinguish event types
- Enabled drag-and-drop for intuitive rescheduling

**Code Reference**:
- `src/components/EventPopover/EventPopover.jsx` - Event creation/editing
- `src/components/EventDetailsPopover/EventDetailsPopover.jsx` - Event details display
- `src/shared/constants/eventForm.config.js` - Event type configurations
- `src/hooks/useEventCreation.js` - Event creation logic

**Algorithm for Event Type Selection**:
```
1. User clicks on calendar date/time
2. System displays event type selector
3. User selects event type (Arrangement, Reminder, Task, or Holiday)
4. System loads type-specific form configuration
5. Form renders with fields appropriate for selected type
6. User fills in event details
7. System validates input data
8. On submission, event is created with type metadata
9. Calendar refreshes to display new event
```

---

#### 2.4 Event Recurrence System
**Completed**: ✅

**Features Implemented**:
- Recurring events with RRule support
- Flexible recurrence patterns (daily, weekly, monthly, yearly)
- Custom recurrence rules
- Visual indication of recurring events

**Decisions Made**:
- Integrated FullCalendar RRule plugin
- Used standard RRule syntax for backend compatibility
- Allowed users to customize recurrence patterns
- Ensured recurring events sync properly with backend

**Code Reference**:
- Event forms include recurrence configuration
- FullCalendar RRule plugin handles rendering

**Recurrence Algorithm**:
```
1. User creates/edits event and enables recurrence
2. User selects recurrence pattern (daily/weekly/monthly/yearly)
3. User sets recurrence parameters:
   - Frequency (every N days/weeks/months)
   - End condition (date or number of occurrences)
   - Days of week (for weekly recurrence)
4. System generates RRule string
5. RRule sent to backend with event data
6. FullCalendar processes RRule and renders all occurrences
7. Each occurrence appears on calendar at appropriate time
```

---

#### 2.5 Calendar Sharing & Collaboration
**Completed**: ✅

**Features Implemented**:
- Calendar sharing via invite links
- Join calendar functionality
- Multi-calendar view
- Calendar-specific color coding
- User permissions management

**Decisions Made**:
- Generated unique tokens for calendar invites
- Implemented URL-based invitation system
- Allowed users to view multiple calendars simultaneously
- Used color coding to distinguish different calendars

**Code Reference**:
- `src/pages/JoinCalendar/JoinCalendar.jsx` - Join calendar page
- `src/components/CalendarGroup/CalendarGroup.jsx` - Multiple calendar display
- `src/services/calendarApi.js` - Calendar sharing API

**Calendar Sharing Algorithm**:
```
1. User creates a calendar
2. User requests to share calendar
3. System generates unique invite token
4. System creates shareable URL with token
5. User shares URL with collaborators
6. Collaborator clicks invite link
7. System validates token
8. System adds collaborator to calendar
9. Collaborator can now view/edit calendar events
10. All calendar members see real-time updates
```

---

### Stage 3: Act - Implementation & Development

#### 3.1 Core Development Milestones

**Milestone 1: Foundation Setup**
- Repository initialization
- Project scaffolding with Vite
- Basic routing structure
- CSS framework setup

**Milestone 2: Authentication Implementation**
- User registration flow
- Login functionality
- Password reset system
- Protected routes
- Token management

**Milestone 3: Calendar Core Features**
- Calendar view components
- Basic event display
- View switching mechanism
- Date navigation

**Milestone 4: Event Management**
- Event type system design
- Event creation forms
- Event editing functionality
- Event deletion
- Color customization

**Milestone 5: Advanced Features**
- Drag-and-drop rescheduling
- Event recurrence
- Calendar sharing
- Multi-calendar support

**Milestone 6: UI/UX Enhancements**
- Responsive design improvements
- Loading states
- Error handling
- Toast notifications
- Avatar system

**Milestone 7: Deployment**
- Docker containerization
- Environment configuration
- Production build optimization

---

### Stage 4: Reflect - Evaluation & Learnings

#### What Went Well:
1. **Component Architecture**: Using Context API for state management provided clean, maintainable code
2. **FullCalendar Integration**: Leveraging FullCalendar saved significant development time and provided robust calendar functionality
3. **Configuration-Driven Design**: Event type configurations made it easy to add new event types
4. **User Experience**: Drag-and-drop and popover-based UI created intuitive user interactions

#### Challenges Faced:
1. **Token Refresh Logic**: Implementing seamless token refresh without disrupting user experience
2. **Cross-View Consistency**: Ensuring events display consistently across different calendar views
3. **Date/Time Handling**: Managing different date formats and timezones
4. **State Synchronization**: Keeping UI in sync with server state after CRUD operations

#### Solutions Implemented:
1. **Token Refresh**: Implemented axios interceptors for automatic token refresh
2. **Consistent Rendering**: Used FullCalendar's built-in rendering engine with custom event content
3. **Date Utilities**: Created centralized DateUtils module for consistent date handling
4. **Optimistic Updates**: Implemented optimistic UI updates with server synchronization

#### Lessons Learned:
1. Context API scales well for medium-sized applications
2. Third-party libraries should be carefully evaluated for flexibility
3. Form validation should happen both client and server-side
4. User feedback (loading states, error messages) is crucial for good UX

#### Future Improvements Identified:
1. Add real-time updates using WebSockets
2. Implement offline support with service workers
3. Add calendar import/export functionality
4. Enhance mobile responsiveness
5. Add event attachments and notes

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Pages      │  │  Components  │  │   Layouts    │       │
│  │              │  │              │  │              │       │
│  │ - Login      │  │ - EventPop   │  │ - AuthLayout │       │
│  │ - Calendar   │  │ - Sidebar    │  │ - MainLayout │       │
│  │ - Register   │  │ - Header     │  │              │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Context (State Management)                 │   │
│  │  - AuthContext  - UserContext  - CalendarContext     │   │
│  │  - EventsContext                                     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Services (API Layer)                    │   │
│  │  - authApi  - userApi  - calendarApi  - eventApi     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ HTTP/HTTPS (Axios)
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                    Backend API Server                       │
│                    (Not in this repo)                       │
│                                                             │
│  - Authentication endpoints                                 │
│  - User management endpoints                                │
│  - Calendar CRUD endpoints                                  │
│  - Event CRUD endpoints                                     │
│  - Calendar sharing endpoints                               │
│                                                             │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                         Database                            │
│  - Users  - Calendars  - Events  - Shared Calendars         │
└─────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
App
├── BrowserRouter
    ├── AuthProvider
        ├── UserProvider
            ├── Toaster
            └── Routes
                ├── AuthLayout
                │   ├── Login
                │   ├── Register
                │   ├── PasswordReset
                │   └── PasswordResetConfirm
                │
                ├── ProtectedRoute (JoinCalendar)
                │   └── JoinCalendar
                │
                └── ProtectedRoute (MainLayout)
                    └── MainLayout
                        ├── Header
                        ├── Sidebar
                        │   ├── CalendarGroup
                        │   │   └── CalendarItem[]
                        │   └── ViewSelector
                        │
                        └── Calendar Views
                            ├── CalendarYear
                            ├── CalendarMonth
                            ├── CalendarWeek
                            └── CalendarDay
                                └── Calendar Component
                                    ├── EventContent
                                    ├── EventPopover
                                    ├── EventDetailsPopover
                                    └── CalendarPopover
```

---

## Algorithm Description

### 1. User Authentication Flow

```
START
│
├─> User enters credentials (email, password)
│
├─> Frontend validates input format
│   ├─> Invalid → Display error, return to input
│   └─> Valid → Continue
│
├─> Send POST request to /auth/login endpoint
│   with credentials
│
├─> Backend validates credentials
│   ├─> Invalid → Return 401 error
│   │   └─> Display error message, return to login
│   └─> Valid → Continue
│
├─> Backend generates JWT access token and refresh token
│
├─> Frontend receives tokens
│
├─> Store access token in localStorage
│
├─> Store refresh token as httpOnly cookie
│
├─> Update AuthContext with user authentication state
│
├─> Redirect to main calendar view
│
└─> END

Token Refresh Sub-Algorithm:
│
├─> API request returns 401 Unauthorized
│
├─> Axios interceptor catches error
│
├─> Check if refresh is already in progress
│   ├─> Yes → Queue this request
│   └─> No → Continue
│
├─> Send POST request to /auth/refresh
│   with refresh token cookie
│
├─> Receive new access token
│
├─> Update stored access token
│
├─> Retry all queued requests with new token
│
└─> Return to normal operation
```

---

### 2. Event Creation Algorithm

```
START
│
├─> User clicks on calendar date/time
│
├─> System captures click information:
│   - Date
│   - Time (if applicable)
│   - All-day flag
│
├─> Display Event Type Selector Modal
│
├─> User selects event type:
│   - ARRANGEMENT
│   - REMINDER
│   - TASK
│   - HOLIDAY
│
├─> Load event type configuration from eventForm.config.js
│   - Form fields
│   - Default color
│   - Validation rules
│
├─> Render event creation form with:
│   - Title field
│   - Start date/time
│   - End date/time (if applicable)
│   - Description
│   - Calendar selection dropdown
│   - Color picker
│   - Recurrence options
│
├─> User fills form fields
│
├─> User submits form
│
├─> Validate form data:
│   ├─> Check required fields
│   ├─> Validate date/time formats
│   ├─> Ensure end > start
│   └─> Validate recurrence rules
│
├─> Invalid → Display validation errors, return to form
│
├─> Valid → Continue
│
├─> Prepare event data payload:
│   {
│     title,
│     start,
│     end,
│     description,
│     type,
│     color,
│     calendar_id,
│     rrule (if recurring)
│   }
│
├─> Send POST request to /calendars/{id}/events
│
├─> Backend processes request:
│   ├─> Validate user permissions
│   ├─> Create event record in database
│   └─> Return created event with ID
│
├─> Frontend receives response
│
├─> Update EventsContext with new event
│
├─> FullCalendar re-renders with new event
│
├─> Display success notification
│
├─> Close event creation modal
│
└─> END
```

---

### 3. Drag-and-Drop Event Rescheduling Algorithm

```
START
│
├─> User initiates drag on event
│
├─> FullCalendar captures drag start
│   - Store original event data
│   - Store original position
│
├─> User drags event to new date/time
│
├─> FullCalendar shows preview at new position
│
├─> User releases mouse (drop)
│
├─> FullCalendar fires eventDrop callback
│   with:
│   - Event object
│   - New start date/time
│   - New end date/time (calculated)
│   - Revert function
│
├─> Calculate new event timing:
│   - New start = drop date/time
│   - Duration = original end - original start
│   - New end = new start + duration
│
├─> Optimistically update UI:
│   - Event appears at new position
│
├─> Prepare update payload:
│   {
│     id: event.id,
│     start: new_start,
│     end: new_end
│   }
│
├─> Send PATCH request to /events/{id}
│
├─> Backend validates and updates:
│   ├─> Check user permissions
│   ├─> Validate new date/time
│   ├─> Update database record
│   └─> Return updated event
│
├─> Check response:
│   ├─> Success → Keep optimistic update
│   └─> Error → Revert to original position
│       ├─> Call revert()
│       └─> Display error message
│
├─> Display success notification
│
└─> END
```

---

### 4. Calendar Sharing Algorithm

```
START (Share Calendar)
│
├─> User clicks "Share Calendar" button
│
├─> Send POST request to /calendars/{id}/share
│
├─> Backend generates unique invite token:
│   - Random UUID
│   - Associated with calendar ID
│   - Expiration timestamp (optional)
│   - Store in database
│
├─> Backend returns invite token
│
├─> Frontend constructs shareable URL:
│   URL = base_url + "/calendars/join/" + token
│
├─> Display URL to user with copy button
│
├─> User copies and shares URL
│
└─> END

START (Join Calendar)
│
├─> Recipient receives invite URL
│
├─> Recipient clicks URL
│
├─> Frontend extracts token from URL parameter
│
├─> Check user authentication:
│   ├─> Not authenticated → Redirect to login
│   │   └─> After login, return to join page
│   └─> Authenticated → Continue
│
├─> Display calendar join confirmation page
│   - Show calendar name
│   - Show owner information
│   - Show "Join Calendar" button
│
├─> User clicks "Join Calendar"
│
├─> Send POST request to /calendars/join
│   with token
│
├─> Backend validates token:
│   ├─> Invalid/expired → Return 404/410 error
│   │   └─> Display error message
│   └─> Valid → Continue
│
├─> Backend creates calendar_users relationship:
│   - calendar_id
│   - user_id
│   - permission level
│
├─> Backend returns calendar data
│
├─> Frontend updates CalendarContext:
│   - Add calendar to user's calendar list
│   - Set as active calendar
│
├─> Redirect to main calendar view
│
├─> Fetch and display calendar events
│
├─> Display success notification
│
└─> END
```

---

### 5. Multi-Calendar Event Loading Algorithm

```
START
│
├─> User has multiple calendars in sidebar
│   Calendar 1: color #FF5733
│   Calendar 2: color #33FF57
│   Calendar 3: color #3357FF
│
├─> Each calendar has checked/unchecked state
│
├─> User toggles calendar visibility
│
├─> Get list of visible (checked) calendars:
│   visible_calendars = calendars.filter(c => c.visible)
│
├─> Initialize empty events array:
│   all_events = []
│
├─> FOR EACH visible calendar:
│   │
│   ├─> Send GET request to /calendars/{calendar_id}/events
│   │   with date range parameters
│   │
│   ├─> Receive events array from backend
│   │
│   ├─> FOR EACH event in response:
│   │   │
│   │   ├─> Enhance event object:
│   │   │   {
│   │   │     ...event,
│   │   │     calendar_color: calendar.color,
│   │   │     calendar_name: calendar.name,
│   │   │     backgroundColor: event.color || calendar.color
│   │   │   }
│   │   │
│   │   └─> Add to all_events array
│   │
│   └─> Continue to next calendar
│
├─> Update EventsContext with all_events
│
├─> FullCalendar re-renders with merged events
│
├─> Events are color-coded by:
│   - Individual event color (if set), OR
│   - Parent calendar color (default)
│
└─> END

Optimization: Use Promise.all() to fetch all
calendars in parallel rather than sequentially
```

---

### 6. Event Type Configuration System

The system uses a configuration-driven approach for event types:

```javascript
// Configuration Structure
EVENT_FORM_CONFIGS = {
  ARRANGEMENT: {
    color: '#default_color',
    icon: ArrangementIcon,
    fields: {
      title: { required: true, type: 'text' },
      start: { required: true, type: 'datetime-local' },
      end: { required: true, type: 'datetime-local' },
      description: { required: false, type: 'textarea' },
      calendar_id: { required: true, type: 'select' },
      color: { required: false, type: 'color' },
      recurrence: { required: false, type: 'rrule' }
    }
  },
  REMINDER: { /* similar structure */ },
  TASK: { /* similar structure */ },
  HOLIDAY: { /* similar structure */ }
}
```

**Algorithm for Form Generation**:
```
1. User selects event type
2. System retrieves configuration for selected type
3. System iterates through fields in configuration
4. For each field:
   - Render appropriate input component based on type
   - Apply validation rules from configuration
   - Set default values if specified
5. Bind onChange handlers to update form state
6. On submit, validate against configuration rules
7. If valid, submit with type-specific data structure
```

**Benefits**:
- Easy to add new event types
- Consistent form behavior
- Centralized validation rules
- Type-safe form handling

---

## Technical Implementation

### State Management Strategy

#### Context API Structure

**AuthContext**:
- **Purpose**: Global authentication state
- **State Variables**:
  - `isAuthenticated`: boolean
  - `user`: user object or null
  - `loading`: boolean
- **Methods**:
  - `login(credentials)`
  - `logout()`
  - `register(userData)`
  - `updateUser(updates)`

**UserContext**:
- **Purpose**: Current user profile data
- **State Variables**:
  - `user`: detailed user profile
  - `avatarUrl`: user avatar URL
- **Methods**:
  - `updateProfile(updates)`
  - `changePassword(oldPass, newPass)`
  - `uploadAvatar(file)`

**CalendarContext**:
- **Purpose**: Calendar list and selection
- **State Variables**:
  - `calendars`: array of calendar objects
  - `activeCalendar`: currently selected calendar
  - `isLoading`: boolean
- **Methods**:
  - `fetchCalendars()`
  - `createCalendar(data)`
  - `updateCalendar(id, updates)`
  - `deleteCalendar(id)`
  - `toggleCalendarVisibility(id)`

**EventsContext**:
- **Purpose**: Event data management
- **State Variables**:
  - `events`: array of all events
  - `isLoading`: boolean
- **Methods**:
  - `fetchEvents(calendarId, startDate, endDate)`
  - `createEvent(eventData)`
  - `updateEvent(id, updates)`
  - `deleteEvent(id)`

---

### Custom Hooks

#### useForm Hook
**Purpose**: Reusable form state management

```javascript
const useForm = (config, onSubmit) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      await onSubmit(formData);
    }
  };

  const resetForm = () => setFormData(initialState);

  return { formData, errors, handleChange, handleSubmit, resetForm };
};
```

#### useCalendar Hook
**Purpose**: Calendar data access

```javascript
const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within CalendarProvider');
  }
  return context;
};
```

#### useDraggable Hook
**Purpose**: Drag-and-drop functionality for events

```javascript
const useDraggable = () => {
  const handleEventDrop = async (dropInfo) => {
    const { event, newStart, newEnd } = dropInfo;

    try {
      await updateEvent(event.id, {
        start: newStart,
        end: newEnd
      });
      toast.success('Event rescheduled');
    } catch (error) {
      dropInfo.revert();
      toast.error('Failed to reschedule');
    }
  };

  return { handleEventDrop };
};
```

---

### API Service Layer

#### Design Pattern: Axios Instance with Interceptors

```javascript
// Base API client configuration
const apiClient = axios.create({
  baseURL: process.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { access_token } = await refreshToken();
        authService.setToken(access_token);
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        authService.clearAuth();
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

---

### Date and Time Handling

#### DateUtils Module

```javascript
export const DateUtils = {
  // Format date for input fields
  formatForInput: (date, includeTime = true) => {
    if (includeTime) {
      return format(date, "yyyy-MM-dd'T'HH:mm");
    }
    return format(date, "yyyy-MM-dd");
  },

  // Parse date from input
  parseFromInput: (dateString) => {
    return new Date(dateString);
  },

  // Format date for display
  formatForDisplay: (date, format = 'PPP') => {
    return format(date, format);
  },

  // Calculate duration between dates
  getDuration: (start, end) => {
    return differenceInMinutes(end, start);
  },

  // Add duration to date
  addDuration: (date, minutes) => {
    return addMinutes(date, minutes);
  }
};
```

---

## Data Flow & State Management

### Event CRUD Flow Diagram

```
User Action → Component → Context → API Service → Backend → Database
     ↑                                                           │
     └──────────── Update UI ←─── Update Context ←───────────────┘
```

### Detailed Event Creation Flow

```
1. User clicks calendar date
   ↓
2. CalendarMonth component captures click
   ↓
3. Opens EventPopover component
   ↓
4. User fills form (managed by useForm hook)
   ↓
5. User submits form
   ↓
6. EventPopover calls onSubmit callback
   ↓
7. Callback invokes EventsContext.createEvent()
   ↓
8. EventsContext calls eventApi.createEvent()
   ↓
9. eventApi sends POST to /calendars/{id}/events
   ↓
10. Backend validates and saves event
    ↓
11. Backend returns created event with ID
    ↓
12. eventApi returns response to EventsContext
    ↓
13. EventsContext updates local events state
    ↓
14. React re-renders Calendar component
    ↓
15. FullCalendar displays new event
    ↓
16. Toast notification confirms success
```

---

## Component Structure

### Atomic Design Hierarchy

#### Atoms (Basic Building Blocks)
- Icons (Edit, Lock, Logout, Plus, etc.)
- Logo component
- Background component

#### Molecules (Simple Components)
- Modal wrapper
- Form inputs
- Color picker
- Event type selector

#### Organisms (Complex Components)
- AuthForm (login/register forms)
- EventPopover (event creation/editing)
- EventDetailsPopover (event display)
- CalendarItem (sidebar calendar entry)
- UserMenu (user profile menu)

#### Templates (Page Layouts)
- AuthLayout (authentication pages)
- MainLayout (main application)

#### Pages (Full Pages)
- Login
- Register
- PasswordReset
- CalendarMonth/Week/Day/Year
- JoinCalendar

---

### Component Communication Patterns

#### Parent-Child Props
```jsx
<EventPopover
  isOpen={isOpen}
  onClose={handleClose}
  onSubmit={handleEventCreate}
  eventType={selectedType}
  initialDate={clickedDate}
/>
```

#### Context Consumption
```jsx
const CalendarMonth = () => {
  const { calendars } = useCalendar();
  const { events, createEvent } = useEvents();

  return (
    <Calendar
      events={events}
      onEventCreate={createEvent}
    />
  );
};
```

#### Custom Event Emission
```jsx
// Emit auth logout event
window.dispatchEvent(new CustomEvent('auth:logout'));

// Listen for auth logout
useEffect(() => {
  const handleLogout = () => {
    // Handle logout
  };

  window.addEventListener('auth:logout', handleLogout);
  return () => window.removeEventListener('auth:logout', handleLogout);
}, []);
```

---

## API Integration

### API Endpoint Structure

#### Authentication Endpoints
```
POST   /auth/register           - Register new user
POST   /auth/login              - Login user
POST   /auth/logout             - Logout user
POST   /auth/refresh            - Refresh access token
POST   /auth/password-reset     - Request password reset
POST   /auth/password-reset/:token - Confirm password reset
```

#### User Endpoints
```
GET    /users/me                - Get current user profile
PATCH  /users/me                - Update user profile
PATCH  /users/me/password       - Change password
POST   /users/me/avatar         - Upload avatar
```

#### Calendar Endpoints
```
GET    /calendars               - Get user's calendars
POST   /calendars               - Create calendar
GET    /calendars/:id           - Get calendar details
PATCH  /calendars/:id           - Update calendar
DELETE /calendars/:id           - Delete calendar
POST   /calendars/:id/share     - Generate share link
POST   /calendars/join          - Join calendar via token
```

#### Event Endpoints
```
GET    /calendars/:id/events    - Get calendar events
POST   /calendars/:id/events    - Create event
GET    /events/:id              - Get event details
PATCH  /events/:id              - Update event
DELETE /events/:id              - Delete event
```

---

### Request/Response Format Examples

#### Create Event Request
```json
{
  "title": "Team Meeting",
  "start": "2025-12-10T14:00:00",
  "end": "2025-12-10T15:00:00",
  "description": "Weekly team sync",
  "type": "arrangement",
  "color": "#FF5733",
  "rrule": "FREQ=WEEKLY;BYDAY=TU;COUNT=10"
}
```

#### Create Event Response
```json
{
  "status": "success",
  "data": {
    "id": "evt_123456",
    "calendar_id": "cal_789",
    "title": "Team Meeting",
    "start": "2025-12-10T14:00:00Z",
    "end": "2025-12-10T15:00:00Z",
    "description": "Weekly team sync",
    "type": "arrangement",
    "color": "#FF5733",
    "rrule": "FREQ=WEEKLY;BYDAY=TU;COUNT=10",
    "created_at": "2025-12-07T10:30:00Z",
    "updated_at": "2025-12-07T10:30:00Z"
  }
}
```
---

## Conclusion

TailSync represents a modern approach to calendar management, built with scalability and user experience in mind. Through the CBL process, we've successfully:

1. ✅ Identified real user needs in calendar management
2. ✅ Designed and implemented core features
3. ✅ Created an intuitive, collaborative platform
4. ✅ Established a solid foundation for future enhancements

The project demonstrates proficiency in:
- React ecosystem and modern frontend development
- RESTful API integration
- State management patterns
- User authentication and authorization
- Collaborative features
- Responsive design principles

### Key Metrics
- **Components**: 40+ reusable components
- **Contexts**: 4 context providers for state management
- **Custom Hooks**: 5 custom hooks for logic reuse
- **Views**: 4 different calendar views
- **Event Types**: 4 distinct event types
- **API Endpoints**: 20+ integrated endpoints

---

**Document Version**: 1.0
**Last Updated**: December 7, 2025
**Maintained By**: [TailSync's team]