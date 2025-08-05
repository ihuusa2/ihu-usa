import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/_next/',
        '/favicon.ico',
        '/manifest.json',
        '/web-app-manifest-*.png',
        '/Images/',
        '/NHS/',
        '/Success',
        '/Cart',
        '/Profile',
        '/Student-Panel',
        '/SignIn',
        '/Mobile-Signup',
        '/Registration-Form/Checkout',
        '/Course-Selection-Form',
        '/Volunteer',
        '/Donate',
        '/Contact',
        '/Events/Register',
        '/Webinars/*',
        '/Video-Gallery',
        '/Photo-Gallery',
        '/FAQ',
        '/Testimonials',
        '/UpcomingCoursePopup',
      ],
    },
    sitemap: 'https://ihu-usa.org/sitemap.xml',
  }
} 