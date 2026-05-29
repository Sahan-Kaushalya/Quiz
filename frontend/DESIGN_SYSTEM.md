# Quiz Master Design System

A comprehensive, modern playful design system engineered for primary school students learning through gamified scholarship quizzes.

## Overview

The Quiz Master design system transforms the intimidating atmosphere of scholarship testing into an inviting, gamified adventure. It features:

- **Modern Playful Style**: Squishy tactile elements, generous whitespace, and high-contrast palette
- **Child-Friendly**: Low-stress, physically easy to navigate, encouraging interface
- **Vibrant Colors**: Deep Indigo, energetic Amber, and success Emerald
- **Generous Spacing**: 8px base unit with touch-friendly interactions
- **Extreme Rounding**: Pill-shaped buttons and soft rounded containers
- **Smooth Animations**: Float, pop-in, bounce, and pulse effects

## Color Palette

### Primary Colors
- **Indigo (#3525cd)**: Trust, reliability, primary actions
- **Amber (#fea619)**: Energy, interactive CTAs, rewards
- **Emerald (#10b981)**: Success, correct answers, positive reinforcement

### Surface Colors
- **Light Gray (#f3f4f6)**: Reduces eye strain, allows cards to pop
- **White (#ffffff)**: Cards and containers
- **Soft Gray (#edeef0)**: Container backgrounds

### State Colors
- **Error**: #ba1a1a (Red for incorrect/errors)
- **Warning**: #f59e0b (Amber for caution)
- **Success**: #10b981 (Emerald for achievements)

## Typography

All typography uses **Nunito Sans** - highly legible for young readers with rounded terminals and open counters.

### Type Scale
- **Display Large**: 48px, Weight 800 (headlines)
- **Headline Large**: 32px, Weight 800
- **Headline Medium**: 24px, Weight 700
- **Body Large**: 20px, Weight 500
- **Body Medium**: 18px, Weight 500 (minimum for children)
- **Label Large**: 16px, Weight 700 (buttons, labels)

## Spacing System

Based on 8px unit:
- **xs**: 4px
- **sm**: 8px (1 unit)
- **md**: 16px (2 units)
- **lg**: 24px (3 units)
- **xl**: 32px (4 units)
- **2xl**: 40px (5 units)
- **3xl**: 48px (6 units)

Mobile margins: 16px | Desktop margins: 40px

## Border Radius

- **sm**: 8px
- **md**: 16px
- **lg**: 24px (primary containers)
- **xl**: 32px
- **2xl**: 48px
- **full**: 9999px (pill buttons)

## Components

### Buttons

#### Primary Button
```jsx
<ButtonPrimary onClick={handleClick}>
  Get Started
</ButtonPrimary>
```
- Amber background with "pressable" 3D effect
- Bold, uppercase text
- Pill-shaped (rounded-full)
- Hover lift animation

#### Secondary Button
```jsx
<ButtonSecondary onClick={handleClick}>
  Learn More
</ButtonSecondary>
```
- White background with Indigo border
- Supports hover and active states

#### Tertiary Button
```jsx
<ButtonTertiary onClick={handleClick}>
  Cancel
</ButtonTertiary>
```
- Ghost style (transparent with hover)
- Subtle interaction

### Cards

#### Standard Card
```jsx
<Card>
  <CardHeader>
    <h2>Title</h2>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
  <CardFooter>
    Actions or metadata
  </CardFooter>
</Card>
```

#### Quiz Card
```jsx
<QuizCard>
  <h3>Question Text</h3>
  <p>Your content here</p>
</QuizCard>
```
- Large padding (40px internal)
- Extreme rounding (24px)
- Focused content layout

### Chips (Multiple Choice)

#### States
```jsx
<Chip>Default</Chip>
<Chip selected>Selected</Chip>
<Chip correct>Correct ✓</Chip>
<Chip incorrect>Incorrect ✕</Chip>
```
- Large, chunky selection targets
- Clear visual feedback
- Smooth transitions

### Progress Bar
```jsx
<ProgressBar 
  value={65} 
  max={100} 
  label="Quiz Progress"
/>
```
- Thick (16px height) with rounded track
- Emerald fill (success color)
- Smooth animation

### Input Fields
```jsx
<TextInput
  label="Full Name"
  placeholder="Enter your name"
  error={error}
/>

<Select
  label="Grade"
  options={[{label: 'Grade 6', value: 'g6'}]}
/>
```
- Pill-shaped (rounded-full)
- Accessible with clear error states
- Generous padding for touch targets

### Toast Notifications
```jsx
const toast = useToast();

toast.success('Great job!');
toast.error('Try again');
toast.info('Information message');
toast.warning('Warning message');
```
- Playful icons and encouraging text
- Pop-up animation (slide-up)
- Auto-dismiss after 4 seconds

### Badges
```jsx
<Badge variant="primary">Primary</Badge>
<Badge variant="success">Achievement</Badge>
<Badge variant="warning">In Progress</Badge>
<Badge variant="error">Needs Review</Badge>
```

## Elevation & Depth

### Shadows
- **Card Shadow**: Soft, 4px + border for subtle elevation
- **Interactive Shadow**: More pronounced for clickable elements
- **Lift Shadow**: Used on hovered/active elements

All shadows use low opacity (4-16%) for soft ambient effect, not harsh.

## Animation & Motion

### Available Animations
- **float**: 3s infinite (upward floating)
- **slide-up**: Toast slide from bottom
- **pop-in**: Scaling + opacity entrance
- **bounce-in**: Playful bounce entrance
- **shake**: Attention-grabbing motion
- **pulse-glow**: Pulsing shadow effect

### Timing
- Interaction feedback: 150ms
- Transition: 200-300ms
- Complex animations: 500ms+

## Responsive Design

### Breakpoints
- **Mobile**: < 768px
  - Single column layout
  - 16px margins
  - Reduced padding
  
- **Desktop**: ≥ 768px
  - Multi-column grid (12-col)
  - 40px margins
  - Full spacing

### Touch Targets
Minimum 48px (3rem) for all interactive elements to accommodate inaccurate taps.

## Usage Example

```jsx
import { 
  ButtonPrimary, 
  QuizCard, 
  Chip, 
  ChipGroup,
  ProgressBar,
  useToast 
} from './ui';

function QuizScreen() {
  const [selected, setSelected] = useState(null);
  const toast = useToast();

  const handleSubmit = () => {
    if (selected === 'correct-answer') {
      toast.success('Great Job! 🎉');
    } else {
      toast.error('Try again! 💪');
    }
  };

  return (
    <div className="min-h-screen bg-surface p-6 md:p-12">
      <QuizCard>
        <h2 className="text-headline-md mb-6">
          What is 2 + 2?
        </h2>
        
        <ProgressBar value={3} max={10} label="Question 3 of 10" />
        
        <ChipGroup className="my-6">
          <Chip 
            selected={selected === 'a'}
            onClick={() => setSelected('a')}
          >
            3
          </Chip>
          <Chip 
            selected={selected === 'correct-answer'}
            onClick={() => setSelected('correct-answer')}
          >
            4
          </Chip>
          <Chip 
            selected={selected === 'c'}
            onClick={() => setSelected('c')}
          >
            5
          </Chip>
        </ChipGroup>

        <div className="flex gap-4">
          <ButtonPrimary onClick={handleSubmit}>
            Submit
          </ButtonPrimary>
          <ButtonSecondary>Skip</ButtonSecondary>
        </div>
      </QuizCard>
    </div>
  );
}
```

## Tailwind Configuration

The design system is fully configured in `tailwind.config.js` with:
- All colors as extended theme values
- Typography scales and weights
- Spacing system
- Border radius utilities
- Custom animations
- Box shadows

Import and use Tailwind classes directly:
```jsx
<div className="bg-primary text-on-primary p-6 rounded-lg shadow-card">
  Content
</div>
```

## Accessibility

- All buttons have focus rings
- Input labels properly associated
- Color used in combination with text/icons
- Sufficient contrast ratios
- Touch targets minimum 48px
- Semantic HTML structure

## Best Practices

✅ **Do:**
- Use the design system components
- Follow the spacing grid (8px base)
- Maintain generous whitespace
- Use encouraging language in copy
- Test on mobile devices
- Implement all feedback animations

❌ **Don't:**
- Mix color meanings (green for error, etc.)
- Reduce touch targets below 48px
- Use harsh, high-opacity shadows
- Create new components outside the system
- Use fonts other than Nunito Sans
- Ignore responsive breakpoints

## Support & Documentation

For questions about implementation:
1. Check the component demo: `ComponentLibraryDemo.jsx`
2. Review component files in `src/ui/`
3. Check Tailwind config for available utilities
4. Refer to this README for guidelines

---

**Quiz Master Design System v1.0**
Built for modern, playful, inclusive learning experiences.
