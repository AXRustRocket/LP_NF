# Waitlist Flow QA Guide

This document provides instructions for testing and verifying the waitlist functionality across the Rust Rocket website.

## Key Features

- **Homepage Auto Modal**: Appears automatically after 3 seconds on first visit
- **CTA Buttons**: All "Join Waitlist" buttons across the site trigger the modal
- **Form Validation**: Client-side email validation with error messages
- **API Submission**: Successful form submissions are sent to the backend API
- **LocalStorage Gate**: Modal only appears once per user (controlled by `rr_wait_home_v3` key)
- **Error Handling**: Friendly error messages for users if submission fails
- **Accessibility**: Focus trapping, keyboard navigation, and screen reader support

## Testing Procedure

### 1. Visual & Functional Testing

| Test                          | Steps                                                | Expected Result                                         |
|-------------------------------|------------------------------------------------------|--------------------------------------------------------|
| **Homepage Auto-Modal**       | 1. Open the homepage in incognito mode<br>2. Wait 3 seconds | Modal appears with form                                |
| **CTA Button Click**          | 1. Click "Join Waitlist" button                      | Modal appears with form                                 |
| **Form Validation**           | 1. Submit empty form<br>2. Submit invalid email      | Error message appears, input highlighted in red         |
| **Submission Success**        | Submit form with valid email                         | Success message appears                                 |
| **One-Time Display**          | 1. Close modal<br>2. Refresh page<br>3. Click button | Modal should not reappear                               |
| **Mobile Responsiveness**     | Test on multiple screen sizes                        | Modal looks good and functions across devices           |

### 2. API Testing

Test the API endpoint directly with cURL:

```bash
curl -X POST http://localhost:8000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}' \
  -v
```

Expected response: `200 OK` with JSON `{"success":true,...}`

### 3. Error Handling & Edge Cases

| Test                          | Steps                                                | Expected Result                                         |
|-------------------------------|------------------------------------------------------|--------------------------------------------------------|
| **Server Error**              | Submit form with API unavailable                     | User-friendly error message appears                     |
| **Network Issue**             | Submit form while offline                            | Network error message, form remains editable            |
| **Multiple Submissions**      | Rapidly click submit button multiple times           | Only one submission, no duplicate entries               |
| **Browser Compatibility**     | Test in Chrome, Firefox, Safari                      | Works consistently across browsers                      |

### 4. Accessibility Testing

| Test                          | Tool/Method                                          | Criteria                                                |
|-------------------------------|------------------------------------------------------|--------------------------------------------------------|
| **Keyboard Navigation**       | Tab through modal without mouse                      | Can navigate all controls with keyboard                 |
| **Screen Reader**             | Use VoiceOver/NVDA                                   | Readable and navigable with screen readers              |
| **Focus Management**          | Open and close modal                                 | Focus properly trapped inside modal, returns on close   |
| **ARIA Attributes**           | Inspect code                                         | Proper aria-* attributes on elements                    |

## Troubleshooting

If issues occur during testing:

1. Check console for JavaScript errors
2. Verify localStorage is working (`localStorage.getItem('rr_wait_home_v3')`)
3. Test API endpoint directly with cURL
4. Clear cache and localStorage to reset state
5. Verify HTML structure in devtools

## CI/CD Integration

The waitlist flow is tested in our CI pipeline with:

- Unit tests: `npm run test:waitlist`
- E2E tests: `npx playwright test e2e/waitlist-open.spec.ts`

## Best Practices

- **Always test in incognito/private mode** to avoid localStorage persistence
- **Reset localStorage between tests** with `localStorage.removeItem('rr_wait_home_v3')`
- **Check network panel** when testing API integration 