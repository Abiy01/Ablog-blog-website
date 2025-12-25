# Web3Forms Setup Guide

This guide will help you set up Web3Forms to receive contact form submissions via email.

## Step 1: Get Your Access Key

1. Visit [Web3Forms.com](https://web3forms.com/)
2. Click on **"Get Started"** or **"Create Access Key"**
3. Enter your email address (the email where you want to receive form submissions)
4. Submit the form
5. Check your email inbox for the Access Key
6. Copy the Access Key (it looks like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

## Step 2: Add Access Key to Environment Variables

1. Create or open the `.env` file in the **root directory** of your project (same level as `package.json`)

2. Add your Web3Forms access key:
   ```env
   VITE_WEB3FORMS_ACCESS_KEY=your-access-key-here
   ```

   Replace `your-access-key-here` with the actual access key you received.

3. **Important:** 
   - The variable name must start with `VITE_` for Vite to expose it to the frontend
   - Never commit your `.env` file to version control (it's already in `.gitignore`)

## Step 3: Restart Your Development Server

After adding the environment variable, restart your development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Step 4: Test the Form

1. Navigate to `/contact` in your browser
2. Fill out the contact form
3. Submit the form
4. Check your email inbox - you should receive the form submission

## How It Works

- When a user submits the contact form, it sends the data to Web3Forms API
- Web3Forms processes the submission and sends an email to the address associated with your access key
- The email includes all form fields: name, email, subject, and message

## Customization Options

### Change Email Subject Line

You can customize the email subject by modifying the form submission in `src/pages/Contact.jsx`:

```javascript
formData.append('subject', `Contact Form: ${formState.subject}`);
```

### Add Honeypot Spam Protection

Web3Forms supports honeypot spam protection. Add this to your form:

```jsx
<input 
  type="checkbox" 
  name="botcheck" 
  className="hidden" 
  style={{ display: 'none' }}
/>
```

### Redirect After Submission

To redirect users after successful submission, add:

```javascript
formData.append('redirect', 'https://yourwebsite.com/thank-you');
```

## Troubleshooting

### "Web3Forms access key is not configured" Error

- Make sure you've added `VITE_WEB3FORMS_ACCESS_KEY` to your `.env` file
- Restart your development server after adding the variable
- Check that the variable name starts with `VITE_`

### Not Receiving Emails

- Check your spam/junk folder
- Verify your access key is correct
- Check the browser console for any error messages
- Make sure the email address associated with your access key is correct

### Form Not Submitting

- Check browser console for errors
- Verify your internet connection
- Check that Web3Forms API is accessible (visit https://api.web3forms.com)

## Free Tier Limits

Web3Forms free tier includes:
- 250 submissions per month
- Basic spam protection
- Email notifications

For more submissions or advanced features, consider upgrading to a paid plan.

## Security Notes

- Never expose your access key in client-side code (always use environment variables)
- The access key is safe to use in frontend code as it's tied to your email
- Web3Forms handles spam protection automatically

## Support

- Web3Forms Documentation: https://docs.web3forms.com/
- Web3Forms Support: https://web3forms.com/contact

