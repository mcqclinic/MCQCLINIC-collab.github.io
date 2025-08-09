/*
This style.css file is minimal because the design primarily uses Tailwind CSS utility classes
directly in the HTML. It includes global base styles and custom styles for the message box
that are not directly handled by Tailwind.
*/

/* --- Global Base Styles --- */
html {
    scroll-behavior: smooth; /* Smooth scrolling for anchor links */
}

body {
    /* Font family is handled by Tailwind or linked in HTML head */
    /* Background and text colors are handled by Tailwind classes on body */
}

/* Animations for header content */
@keyframes fadeInFromBottom {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in-up {
    animation: fadeInFromBottom 1s ease-out forwards;
}


/* --- Custom Message Box Styles --- */
/* These styles control the appearance and animation of the custom modal message box. */

#custom-message-box {
    /* These are mostly handled by Tailwind classes on the element */
    /* `hidden` and `opacity-0` are initial states, JS adds `block` and `opacity-100` */
}

#custom-message-box.show {
    display: flex; /* Make it visible */
    opacity: 1; /* Fade in */
}

#custom-message-box.show > div { /* Target the inner content div for scale animation */
    transform: scale(1); /* Scale up */
}
