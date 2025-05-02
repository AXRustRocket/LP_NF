# Rust Rocket - Deployment Smoke Test

This document provides a step-by-step checklist to verify that all components of the Rust Rocket website are functioning correctly after deployment.

## Pre-Deployment Checklist

- [ ] Ensure all environment variables are set in Netlify:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - Any other environment-specific variables

## Post-Deployment Tests

### 1. Website Loading

- [ ] Verify the website loads properly at the production URL
- [ ] Check that all images and assets load correctly
- [ ] Confirm the particles background animation is working

### 2. Responsive Design

- [ ] Test on desktop (1920px width)
- [ ] Test on tablet (768px width)
- [ ] Test on mobile (375px width)
- [ ] Verify navigation is properly responsive
- [ ] Check font sizes scale appropriately

### 3. Waitlist Form

- [ ] Submit a test email to the waitlist form
- [ ] Verify the data appears in the Supabase `waitlist` table
- [ ] Check that the welcome email function is triggered
- [ ] Confirm the `welcome_email_sent` field is updated to `true`

### 4. Legal Pages

- [ ] Verify all legal links work:
  - [ ] Imprint
  - [ ] Privacy Policy
  - [ ] Terms of Use
  - [ ] AML Policy
- [ ] Check that redirect rules are working correctly

### 5. Performance Metrics

- [ ] Run Lighthouse test for:
  - [ ] Performance (target: 90+)
  - [ ] Accessibility (target: 95+)
  - [ ] Best Practices (target: 95+)
  - [ ] SEO (target: 100)
- [ ] Verify there are no critical rendering issues
- [ ] Check load time is under 2 seconds on good connection

### 6. Browser Compatibility

- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari
- [ ] Test on Edge

## Issue Reporting

If you encounter any issues during the smoke test, please document them with:
1. What was expected
2. What actually happened
3. Screenshot if applicable
4. Browser and device information
5. Steps to reproduce

Submit issues to the project repository or contact the development team directly. 