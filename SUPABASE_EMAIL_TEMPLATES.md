# Supabase Email Template Customization for EduFlow

This guide will help you customize the Supabase email templates to include EduFlow branding and create a professional user experience.

## Overview

Supabase provides several email templates that you can customize:

- **Confirm signup** - Sent when users sign up
- **Invite user** - Sent when inviting users to your app
- **Magic link** - Sent for passwordless authentication
- **Change email address** - Sent when users change their email
- **Reset password** - Sent when users request password reset

## Step 1: Access Email Templates

1. Go to your Supabase dashboard
2. Navigate to **Authentication** → **Email Templates**
3. You'll see all available email templates

## Step 2: Customize Email Templates

### 1. Confirm Signup Template

This is the most important template as it's the first email users receive.

**Subject Line:**

```
Welcome to EduFlow - Confirm Your Account
```

**Email Content:**

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to EduFlow</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            color: #3B82F6;
            margin-bottom: 10px;
        }
        .tagline {
            color: #6B7280;
            font-size: 16px;
        }
        .content {
            margin-bottom: 30px;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
            color: white;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
            transition: all 0.3s ease;
        }
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #E5E7EB;
            color: #6B7280;
            font-size: 14px;
        }
        .features {
            background: #F3F4F6;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .feature {
            display: flex;
            align-items: center;
            margin: 10px 0;
        }
        .feature-icon {
            width: 20px;
            height: 20px;
            background: #3B82F6;
            border-radius: 50%;
            margin-right: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🎓 EduFlow</div>
            <div class="tagline">Empowering your academic journey with AI-driven personalization</div>
        </div>
        
        <div class="content">
            <h2>Welcome to EduFlow!</h2>
            <p>Hi there! 👋</p>
            <p>Thank you for joining EduFlow, your AI-powered study companion. We're excited to help you achieve your academic goals with personalized learning experiences.</p>
            
            <div class="features">
                <h3>What you can do with EduFlow:</h3>
                <div class="feature">
                    <div class="feature-icon">📚</div>
                    <span>Create and manage your courses with smart tracking</span>
                </div>
                <div class="feature">
                    <div class="feature-icon">🧠</div>
                    <span>Generate AI-powered flashcards and quizzes</span>
                </div>
                <div class="feature">
                    <div class="feature-icon">📊</div>
                    <span>Track your progress with detailed analytics</span>
                </div>
                <div class="feature">
                    <div class="feature-icon">🎯</div>
                    <span>Get personalized study recommendations</span>
                </div>
            </div>
            
            <p>To get started, please confirm your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
                <a href="{{ .ConfirmationURL }}" class="button">Confirm Email Address</a>
            </div>
            
            <p style="font-size: 14px; color: #6B7280; text-align: center;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="{{ .ConfirmationURL }}" style="color: #3B82F6;">{{ .ConfirmationURL }}</a>
            </p>
        </div>
        
        <div class="footer">
            <p>This link will expire in 24 hours for security reasons.</p>
            <p>If you didn't create an account with EduFlow, you can safely ignore this email.</p>
            <p>© 2024 EduFlow. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

### 2. Magic Link Template

**Subject Line:**

```
Your EduFlow Login Link
```

**Email Content:**

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EduFlow Login</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            color: #3B82F6;
            margin-bottom: 10px;
        }
        .tagline {
            color: #6B7280;
            font-size: 16px;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
            color: white;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #E5E7EB;
            color: #6B7280;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🎓 EduFlow</div>
            <div class="tagline">Your AI-powered study companion</div>
        </div>
        
        <div style="text-align: center;">
            <h2>Welcome back to EduFlow!</h2>
            <p>Click the button below to securely log in to your account:</p>
            
            <a href="{{ .TokenHash }}" class="button">Login to EduFlow</a>
            
            <p style="font-size: 14px; color: #6B7280;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="{{ .TokenHash }}" style="color: #3B82F6;">{{ .TokenHash }}</a>
            </p>
            
            <p style="margin-top: 30px; color: #6B7280;">
                This login link will expire in 1 hour for security reasons.
            </p>
        </div>
        
        <div class="footer">
            <p>If you didn't request this login link, you can safely ignore this email.</p>
            <p>© 2024 EduFlow. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

### 3. Reset Password Template

**Subject Line:**

```
Reset Your EduFlow Password
```

**Email Content:**

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password - EduFlow</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            color: #3B82F6;
            margin-bottom: 10px;
        }
        .tagline {
            color: #6B7280;
            font-size: 16px;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
            color: white;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #E5E7EB;
            color: #6B7280;
            font-size: 14px;
        }
        .security-note {
            background: #FEF2F2;
            border: 1px solid #FECACA;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            color: #991B1B;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🎓 EduFlow</div>
            <div class="tagline">Your AI-powered study companion</div>
        </div>
        
        <div style="text-align: center;">
            <h2>Reset Your Password</h2>
            <p>We received a request to reset your EduFlow password.</p>
            
            <div class="security-note">
                <strong>🔒 Security Note:</strong> Only click the button below if you requested this password reset.
            </div>
            
            <a href="{{ .TokenHash }}" class="button">Reset Password</a>
            
            <p style="font-size: 14px; color: #6B7280;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="{{ .TokenHash }}" style="color: #3B82F6;">{{ .TokenHash }}</a>
            </p>
            
            <p style="margin-top: 30px; color: #6B7280;">
                This password reset link will expire in 1 hour for security reasons.
            </p>
        </div>
        
        <div class="footer">
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
            <p>Your password will remain unchanged.</p>
            <p>© 2024 EduFlow. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

### 4. Change Email Address Template

**Subject Line:**

```
Confirm Your New Email Address - EduFlow
```

**Email Content:**

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirm Email Change - EduFlow</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            color: #3B82F6;
            margin-bottom: 10px;
        }
        .tagline {
            color: #6B7280;
            font-size: 16px;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #10B981 0%, #059669 100%);
            color: white;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #E5E7EB;
            color: #6B7280;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🎓 EduFlow</div>
            <div class="tagline">Your AI-powered study companion</div>
        </div>
        
        <div style="text-align: center;">
            <h2>Confirm Your New Email Address</h2>
            <p>You've requested to change your email address for your EduFlow account.</p>
            <p>To complete this change, please click the button below:</p>
            
            <a href="{{ .TokenHash }}" class="button">Confirm Email Change</a>
            
            <p style="font-size: 14px; color: #6B7280;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="{{ .TokenHash }}" style="color: #3B82F6;">{{ .TokenHash }}</a>
            </p>
            
            <p style="margin-top: 30px; color: #6B7280;">
                This confirmation link will expire in 24 hours.
            </p>
        </div>
        
        <div class="footer">
            <p>If you didn't request this email change, please contact our support team immediately.</p>
            <p>© 2024 EduFlow. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

### 5. Invite User Template

**Subject Line:**

```
You've been invited to join EduFlow!
```

**Email Content:**

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invitation to EduFlow</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            color: #3B82F6;
            margin-bottom: 10px;
        }
        .tagline {
            color: #6B7280;
            font-size: 16px;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
            color: white;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #E5E7EB;
            color: #6B7280;
            font-size: 14px;
        }
        .features {
            background: #F3F4F6;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🎓 EduFlow</div>
            <div class="tagline">AI-powered study platform</div>
        </div>
        
        <div style="text-align: center;">
            <h2>You're Invited to Join EduFlow!</h2>
            <p>Someone has invited you to join EduFlow, the AI-powered study platform that adapts to your learning style.</p>
            
            <div class="features">
                <h3>What you'll get with EduFlow:</h3>
                <p>✅ Personalized study recommendations<br>
                ✅ AI-generated flashcards and quizzes<br>
                ✅ Progress tracking and analytics<br>
                ✅ Collaborative study tools</p>
            </div>
            
            <p>Click the button below to accept the invitation and create your account:</p>
            
            <a href="{{ .TokenHash }}" class="button">Accept Invitation</a>
            
            <p style="font-size: 14px; color: #6B7280;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="{{ .TokenHash }}" style="color: #3B82F6;">{{ .TokenHash }}</a>
            </p>
        </div>
        
        <div class="footer">
            <p>This invitation will expire in 7 days.</p>
            <p>© 2024 EduFlow. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

## Step 3: Customize Branding Elements

### Color Scheme

The templates use EduFlow's color scheme:

- **Primary Blue**: `#3B82F6` (for main actions)
- **Success Green**: `#10B981` (for confirmations)
- **Warning Red**: `#EF4444` (for password resets)
- **Purple**: `#8B5CF6` (for invitations)

### Logo and Branding

- **Logo**: 🎓 EduFlow (using emoji for simplicity)
- **Tagline**: "Empowering your academic journey with AI-driven personalization"
- **Consistent styling** across all templates

## Step 4: Test Your Templates

1. **Preview templates** in the Supabase dashboard
2. **Send test emails** to yourself
3. **Check mobile responsiveness** on different devices
4. **Verify all links work** correctly

## Step 5: Advanced Customization

### Add Custom Variables

You can use these variables in your templates:

- `{{ .TokenHash }}` - The confirmation/reset link
- `{{ .ConfirmationURL }}` - Alternative confirmation URL
- `{{ .Email }}` - User's email address
- `{{ .SiteURL }}` - Your site URL

### Add Analytics Tracking

```html
<!-- Add to the bottom of your templates -->
<img src="https://your-analytics-domain.com/track?email={{ .Email }}&template=confirm" width="1" height="1" style="display:none;">
```

### Custom Fonts

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
```

## Best Practices

1. **Keep it simple** - Avoid complex layouts that might break in email clients
2. **Use inline CSS** - Many email clients strip out `<style>` tags
3. **Test thoroughly** - Check on Gmail, Outlook, Apple Mail, etc.
4. **Mobile-first** - Ensure templates work well on mobile devices
5. **Clear call-to-action** - Make buttons prominent and easy to click
6. **Security messaging** - Include security notes for sensitive actions

## Troubleshooting

### Common Issues

1. **Images not loading** - Use absolute URLs for images
2. **Styling not applied** - Use inline CSS instead of external stylesheets
3. **Links not working** - Ensure proper URL encoding
4. **Mobile display issues** - Test on actual mobile devices

### Email Client Compatibility

- **Gmail**: Good support for most features
- **Outlook**: Limited CSS support, use table-based layouts
- **Apple Mail**: Good support for modern CSS
- **Mobile clients**: Test on iOS Mail and Gmail mobile

---

Your EduFlow email templates are now professionally branded and ready to provide a great user experience! 🎓
