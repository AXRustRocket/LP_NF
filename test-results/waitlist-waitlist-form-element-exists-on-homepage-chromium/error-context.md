# Test info

- Name: waitlist form element exists on homepage
- Location: /Users/m.schroeder/Desktop/RR_Content/axiom_LP/tests/smoke/waitlist.spec.ts:126:5

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: locator('input[type="email"]').first()
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for locator('input[type="email"]').first()

    at /Users/m.schroeder/Desktop/RR_Content/axiom_LP/tests/smoke/waitlist.spec.ts:135:28
```

# Page snapshot

```yaml
- heading "Site not found" [level=1]
- paragraph: Looks like you followed a broken link or entered a URL that doesn’t exist on Netlify.
- separator
- paragraph:
  - text: If this is your site, and you weren’t expecting a 404 for this path, please visit Netlify’s
  - link "“page not found” support guide":
    - /url: https://answers.netlify.com/t/support-guide-i-ve-deployed-my-site-but-i-still-see-page-not-found/125?utm_source=404page&utm_campaign=community_tracking
  - text: for troubleshooting tips.
- paragraph:
  - text: "Netlify Internal ID:"
  - code: 01JTH0WD5K7AD8G07WJGMB7V2C
```

# Test source

```ts
   35 |     });
   36 |     
   37 |     if (!response.ok()) {
   38 |         console.error(`Supabase check failed with status ${response.status()}:`, await response.text());
   39 |         return false;
   40 |     }
   41 |
   42 |     const data = await response.json();
   43 |     // Check if the returned array is not empty
   44 |     return Array.isArray(data) && data.length > 0;
   45 |   } catch (error) {
   46 |     console.error('Error checking Supabase:', error);
   47 |     return false;
   48 |   }
   49 | }
   50 |
   51 | test('waitlist function returns 200 OK with valid email', async ({ request }) => {
   52 |   // Generate a unique test email to avoid duplicates in the database
   53 |   const testEmail = `test-${Date.now()}@example.com`;
   54 |   
   55 |   // Send POST request to the waitlist function
   56 |   const response = await request.post(`${baseURL}/.netlify/functions/waitlist`, {
   57 |     data: {
   58 |       email: testEmail,
   59 |       name: 'Test User'
   60 |     }
   61 |   });
   62 |   
   63 |   // Verify response status code
   64 |   expect(response.status()).toBe(200);
   65 |   
   66 |   // Verify response body
   67 |   const data = await response.json();
   68 |   expect(data.success).toBe(true);
   69 |   expect(data.message).toBeTruthy();
   70 | });
   71 |
   72 | test('waitlist function returns 409 for duplicate email', async ({ request }) => {
   73 |   // Use a fixed email that we'll try to register twice
   74 |   const testEmail = `duplicate-${Date.now()}@example.com`;
   75 |   
   76 |   // First submission should succeed
   77 |   const firstResponse = await request.post(`${baseURL}/.netlify/functions/waitlist`, {
   78 |     data: {
   79 |       email: testEmail,
   80 |       name: 'Duplicate Test'
   81 |     }
   82 |   });
   83 |   
   84 |   expect(firstResponse.status()).toBe(200);
   85 |   
   86 |   // Second submission should return 409 Conflict
   87 |   const duplicateResponse = await request.post(`${baseURL}/.netlify/functions/waitlist`, {
   88 |     data: {
   89 |       email: testEmail,
   90 |       name: 'Duplicate Test Again'
   91 |     }
   92 |   });
   93 |   
   94 |   // Verify response status code for duplicate
   95 |   expect(duplicateResponse.status()).toBe(409);
   96 |   
   97 |   // Verify response body still indicates success
   98 |   const data = await duplicateResponse.json();
   99 |   expect(data.success).toBe(true);
  100 | });
  101 |
  102 | test('waitlist function returns 400 with invalid email', async ({ request }) => {
  103 |   // Send POST request with invalid email
  104 |   const response = await request.post(`${baseURL}/.netlify/functions/waitlist`, {
  105 |     data: {
  106 |       email: 'invalid-email',
  107 |       name: 'Test User'
  108 |     }
  109 |   });
  110 |   
  111 |   // Verify response status code
  112 |   expect(response.status()).toBe(400);
  113 | });
  114 |
  115 | test('waitlist function returns 405 for non-POST requests', async ({ request }) => {
  116 |   // Send GET request (should be rejected)
  117 |   const response = await request.get(`${baseURL}/.netlify/functions/waitlist`);
  118 |   
  119 |   // Verify response status code
  120 |   expect(response.status()).toBe(405);
  121 | });
  122 |
  123 | /**
  124 |  * Check that there's a waitlist-related form on the homepage
  125 |  */
  126 | test('waitlist form element exists on homepage', async ({ page }) => {
  127 |   // Navigate to the homepage
  128 |   await page.goto('/');
  129 |   
  130 |   // Either the normal hero waitlist form or any form with an email input
  131 |   // should be present on the page
  132 |   const emailInput = page.locator('input[type="email"]').first();
  133 |   
  134 |   // Verify input exists
> 135 |   await expect(emailInput).toBeVisible();
      |                            ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
  136 |   
  137 |   // Find a submit button nearby
  138 |   const submitButton = page.locator('button[type="submit"]').first();
  139 |   
  140 |   // Verify button exists
  141 |   await expect(submitButton).toBeVisible();
  142 | });
  143 |
  144 | test('waitlist function returns 200 OK and saves to Supabase', async ({ request }) => {
  145 |   // Generate a unique test email
  146 |   const testEmail = `test-${Date.now()}@example.com`;
  147 |
  148 |   // Send POST request
  149 |   const response = await request.post(`${baseURL}/.netlify/functions/waitlist`, {
  150 |     data: {
  151 |       email: testEmail,
  152 |       name: 'Supabase Test User'
  153 |     }
  154 |   });
  155 |
  156 |   // Verify response status and body
  157 |   expect(response.status()).toBe(200);
  158 |   const data = await response.json();
  159 |   expect(data.success).toBe(true);
  160 |   expect(data.message).toBeTruthy();
  161 |
  162 |   // Wait a short time for DB write consistency
  163 |   await new Promise(resolve => setTimeout(resolve, 1500)); // Adjust timing if needed
  164 |
  165 |   // Verify the email exists in Supabase
  166 |   const emailExists = await checkSupabaseForEmail(request, testEmail);
  167 |   expect(emailExists, `Email ${testEmail} should exist in Supabase after successful submission`).toBe(true);
  168 | }); 
```