Yes. For MGTV, I would **avoid authentication modals entirely**. Authentication should feel like a proper part of the platform, with dedicated, beautifully designed screens and a clear progression from discovery → account creation → profile setup → content.

Based on the MGTV analysis, the account system needs to support registration, sign-in, profiles, preferences, content controls, and subscription access. 

## MGTV Authentication & Account Flow

I would structure the customer authentication experience around these **dedicated screens**:

### 1. Welcome / Authentication Landing

**Route:** `/auth`

A branded MGTV introduction rather than immediately throwing the user into a form.

**Contains:**

* MGTV logo
* Short statement about the platform
* Background artwork/video
* **Sign In**
* **Create Account**
* Continue browsing
* Social sign-in if ultimately approved

This gives the authentication experience a premium streaming-service feel.

---

### 2. Sign In

**Route:** `/auth/sign-in`

Dedicated login page.

**Fields:**

* Email
* Password
* Show/hide password

**Actions:**

* Sign In
* Forgot Password
* Create Account

Optional:

* Continue with Google/Apple/etc., depending on the final authentication provider.

**Flow:**

`Sign In → Account → Profile Selection`

---

### 3. Create Account

**Route:** `/auth/register`

This should be a proper registration screen, not a modal.

**Fields:**

* First name
* Last name
* Email
* Password
* Confirm password

**Actions:**

* Create Account
* Already have an account? Sign In

I'd keep this screen relatively simple. Don't ask the user 15 questions during registration.

---

### 4. Email Verification

**Route:** `/auth/verify-email`

After registration:

> **Check your email**

" We've sent a verification link to your email address."

**Actions:**

* Resend email
* Change email
* Back to sign in

This is its own state/page so the flow feels intentional.

---

### 5. Forgot Password

**Route:** `/auth/forgot-password`

Simple dedicated screen:

> **Forgot your password?**

Enter email → **Send Reset Link**

---

### 6. Password Reset

**Route:** `/auth/reset-password`

After following the email link:

**Fields:**

* New password
* Confirm new password

**Action:**

* Reset Password

Then:

> **Password updated successfully**

**Continue to Sign In**

---

# Then comes the important MGTV-specific part

Authentication shouldn't end at "you're logged in."

MGTV has a **sub-profile management system supporting up to five profiles**, including age categories, language/content preferences, favorite genres/artists/regions, notification preferences, autoplay and parental/content controls. 

So I would separate **Account Authentication** from **Profile Experience**.

---

## 7. Profile Selection

**Route:** `/profiles`

This is essentially MGTV's Netflix-style account gateway.

Example:

> **Who's watching?**

```text
      👤              👤              👤
    Shevon          Arietha          Kids
    Profile         Profile         Profile

                    + Add Profile
```

Up to **5 profiles**.

Clicking a profile takes the user into MGTV.

This screen can also contain:

**Manage Profiles**

---

## 8. Create Profile

**Route:** `/profiles/create`

Dedicated profile creation experience.

**Fields/options:**

* Profile avatar
* Display name
* Age category:

  * Adult
  * Teen
  * Child
* Language preference
* Content preferences
* Favorite genres

The analysis explicitly specifies these profile capabilities. 

Rather than making this one giant form, I'd make it a **beautiful multi-step onboarding flow**.

---

## 9. Profile Preferences

**Route:** `/profiles/[id]/preferences`

For an existing profile:

### Interests

* Favorite genres
* Favorite artists/performers
* Favorite islands/regions

### Viewing

* Autoplay
* Language
* Content preferences

### Notifications

* New episodes
* Favorite artists
* Events
* MGTV announcements

This is where personalization starts becoming useful.

---

## 10. Profile Content Controls

**Route:** `/profiles/[id]/content-controls`

For parental/child profiles:

* Content rating restrictions
* Viewing time limits
* Purchase restrictions
* Community/chat restrictions

These controls are specifically included in the MGTV analysis. 

---

# Account Management

Once the customer is inside MGTV, I'd give them a proper account area rather than mixing account settings into random pages.

### 11. Account Overview

**Route:** `/account`

Shows:

* Account name
* Email
* Active subscription
* Profiles
* Recent account activity
* Quick links

---

### 12. Account Preferences

**Route:** `/account/preferences`

Account-level settings such as:

* Email preferences
* Communication preferences
* Language
* Security preferences

---

### 13. Subscription Management

**Route:** `/account/subscription`

This connects directly into MGTV+.

Shows:

* Current plan
* Billing frequency
* Subscription status
* Renewal information
* Available plans
* Upgrade/downgrade
* Cancel subscription
* Payment management

The MGTV analysis specifies free and standard subscription tiers, trials, payment management and local-currency support. 

---

# The complete customer auth/account screen set

I'd therefore count the flow as:

| #  | Screen                   | Route                             |
| -- | ------------------------ | --------------------------------- |
| 1  | Authentication Landing   | `/auth`                           |
| 2  | Sign In                  | `/auth/sign-in`                   |
| 3  | Create Account           | `/auth/register`                  |
| 4  | Verify Email             | `/auth/verify-email`              |
| 5  | Forgot Password          | `/auth/forgot-password`           |
| 6  | Reset Password           | `/auth/reset-password`            |
| 7  | Profile Selection        | `/profiles`                       |
| 8  | Create Profile           | `/profiles/create`                |
| 9  | Profile Preferences      | `/profiles/[id]/preferences`      |
| 10 | Profile Content Controls | `/profiles/[id]/content-controls` |
| 11 | Account Overview         | `/account`                        |
| 12 | Account Preferences      | `/account/preferences`            |
| 13 | Subscription Management  | `/account/subscription`           |

### But I would NOT make all 13 mandatory for every user.

That's important.

The **normal first-time journey** should be:

```text
MGTV
  ↓
Welcome
  ↓
Create Account
  ↓
Verify Email
  ↓
Create Profile
  ↓
Choose Interests
  ↓
MGTV Home
```

Returning user:

```text
MGTV
  ↓
Sign In
  ↓
Profile Selection
  ↓
MGTV Home
```

Forgot password:

```text
Sign In
  ↓
Forgot Password
  ↓
Enter Email
  ↓
Check Email
  ↓
Reset Password
  ↓
Sign In
```

And an existing user can independently go:

```text
Profile
   ↓
Account
   ├── Preferences
   ├── Subscription
   └── Profile Management
```

## One design principle I'd strongly recommend

**Don't make authentication feel like a separate corporate application.**

MGTV is an entertainment/streaming platform. The auth screens should visually feel like MGTV:

**cinematic → premium → simple → visual → low friction.**

For example, the Sign In screen could have a large MGTV cinematic image/video treatment on one side and the actual form on the other on desktop, while becoming a full-screen branded experience on mobile.

And **no modal authentication**. Every major action gets a real route and a real screen, which makes the UX easier to navigate, deep-link, protect with route guards, and maintain.

This also fits nicely with the existing **36 customer-web-page estimate**: these are legitimate application screens, while things like success states, password validation, loading states, confirmation messages, etc. are **UI states within those screens—not extra billable pages**.
