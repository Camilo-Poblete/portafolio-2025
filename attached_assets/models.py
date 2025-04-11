"""
Data models for the portfolio application.
Since we're not using a database, we'll store the data in Python structures.
"""

# Sample projects data
projects = [
    {
        'id': 1,
        'title': 'E-commerce Platform',
        'description': 'A full-stack e-commerce platform built with modern technologies. Features include product listing, shopping cart, user authentication, payment processing, and order management.',
        'long_description': 'This comprehensive e-commerce solution provides businesses with a robust platform to sell products online. The system includes an intuitive admin dashboard for managing products, inventory, and orders. Customer features include personalized recommendations, wish lists, and order tracking.',
        'image': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
        'technologies': ['Python', 'Flask', 'React', 'PostgreSQL', 'Docker'],
        'categories': ['Web Development', 'Full Stack'],
        'github_url': 'https://github.com/username/ecommerce-platform',
        'live_url': 'https://ecommerce-demo.example.com',
        'featured': True
    },
    {
        'id': 2,
        'title': 'Machine Learning Image Classifier',
        'description': 'An image classification model trained on a large dataset of images to recognize and categorize objects with high accuracy.',
        'long_description': 'This project implements a convolutional neural network (CNN) for image classification. It was trained on a dataset of over 50,000 labeled images across 10 categories. The model achieves 95% accuracy on the test dataset and can be easily integrated into other applications through a REST API.',
        'image': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
        'technologies': ['Python', 'TensorFlow', 'Keras', 'OpenCV', 'NumPy'],
        'categories': ['Machine Learning', 'Computer Vision'],
        'github_url': 'https://github.com/username/image-classifier',
        'live_url': 'https://ml-classifier-demo.example.com',
        'featured': True
    },
    {
        'id': 3,
        'title': 'Task Management Application',
        'description': 'A productivity application that helps users organize tasks, set priorities, and track progress on projects.',
        'long_description': 'This task management application allows users to create projects, add tasks, set due dates, and track progress. It features drag-and-drop organization, email reminders, and collaboration tools. The application uses a responsive design that works well on desktop and mobile devices.',
        'image': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
        'technologies': ['JavaScript', 'Vue.js', 'Node.js', 'Express', 'MongoDB'],
        'categories': ['Web Development', 'Productivity'],
        'github_url': 'https://github.com/username/task-manager',
        'live_url': 'https://task-app-demo.example.com',
        'featured': True
    },
    {
        'id': 4,
        'title': 'IoT Home Automation System',
        'description': 'A system that connects and controls smart home devices, allowing users to automate routines and monitor their home remotely.',
        'long_description': 'This IoT solution integrates with popular smart home devices to provide a unified control interface. Users can create automation routines based on time, device status, or location. The system includes a mobile app for remote monitoring and control, along with a voice assistant integration.',
        'image': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/raspberrypi/raspberrypi-original.svg',
        'technologies': ['Python', 'Raspberry Pi', 'MQTT', 'React Native', 'Firebase'],
        'categories': ['IoT', 'Mobile Development'],
        'github_url': 'https://github.com/username/home-automation',
        'live_url': None,
        'featured': False
    },
    {
        'id': 5,
        'title': 'Financial Dashboard',
        'description': 'An interactive dashboard that visualizes financial data, stock trends, and investment portfolios for better decision making.',
        'long_description': 'This financial dashboard provides real-time visualization of market data, portfolio performance, and investment analytics. It integrates with multiple financial APIs to provide stock quotes, historical data, and news. The dashboard includes customizable widgets that users can arrange according to their preferences.',
        'image': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/d3js/d3js-original.svg',
        'technologies': ['JavaScript', 'D3.js', 'React', 'Express', 'MongoDB'],
        'categories': ['Data Visualization', 'Finance'],
        'github_url': 'https://github.com/username/financial-dashboard',
        'live_url': 'https://finance-dashboard-demo.example.com',
        'featured': False
    },
    {
        'id': 6,
        'title': 'Social Media Analytics Tool',
        'description': 'A tool that analyzes social media data to provide insights on engagement, audience demographics, and content performance.',
        'long_description': 'This analytics platform collects and processes data from multiple social media platforms to provide comprehensive insights. It features sentiment analysis, engagement metrics, audience demographics, and content performance indicators. The tool helps marketers optimize their social media strategy based on data-driven recommendations.',
        'image': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
        'technologies': ['Python', 'Flask', 'React', 'PostgreSQL', 'Natural Language Processing'],
        'categories': ['Data Analytics', 'Web Development'],
        'github_url': 'https://github.com/username/social-analytics',
        'live_url': 'https://social-analytics-demo.example.com',
        'featured': False
    }
]

# Skills data
skills = [
    {
        'category': 'Programming Languages',
        'skill_list': [
            {'name': 'Python', 'level': 90},
            {'name': 'JavaScript', 'level': 85},
            {'name': 'TypeScript', 'level': 80},
            {'name': 'Java', 'level': 75},
            {'name': 'C#', 'level': 70},
            {'name': 'SQL', 'level': 85}
        ]
    },
    {
        'category': 'Web Development',
        'skill_list': [
            {'name': 'HTML5', 'level': 95},
            {'name': 'CSS3', 'level': 90},
            {'name': 'React', 'level': 85},
            {'name': 'Vue.js', 'level': 80},
            {'name': 'Angular', 'level': 75},
            {'name': 'Node.js', 'level': 85},
            {'name': 'Flask', 'level': 90},
            {'name': 'Django', 'level': 85}
        ]
    },
    {
        'category': 'Database Technologies',
        'skill_list': [
            {'name': 'PostgreSQL', 'level': 90},
            {'name': 'MongoDB', 'level': 85},
            {'name': 'MySQL', 'level': 80},
            {'name': 'Redis', 'level': 75},
            {'name': 'SQLite', 'level': 85}
        ]
    },
    {
        'category': 'DevOps & Tools',
        'skill_list': [
            {'name': 'Git', 'level': 90},
            {'name': 'Docker', 'level': 85},
            {'name': 'Kubernetes', 'level': 75},
            {'name': 'CI/CD', 'level': 80},
            {'name': 'AWS', 'level': 85},
            {'name': 'Azure', 'level': 75}
        ]
    },
    {
        'category': 'Data Science & AI',
        'skill_list': [
            {'name': 'Machine Learning', 'level': 80},
            {'name': 'TensorFlow', 'level': 75},
            {'name': 'NumPy', 'level': 85},
            {'name': 'Pandas', 'level': 85},
            {'name': 'Data Visualization', 'level': 80}
        ]
    }
]

# Work experience data
work_experience = [
    {
        'company': 'Tech Innovations Inc.',
        'position': 'Senior Software Engineer',
        'period': 'Jan 2020 - Present',
        'description': 'Leading the development of enterprise-level web applications using modern technologies. Managing a team of 5 developers and collaborating with product managers to deliver high-quality software solutions.',
        'achievements': [
            'Redesigned the company\'s flagship product, improving performance by 40%',
            'Implemented CI/CD pipeline, reducing deployment time by 60%',
            'Led the migration from monolithic architecture to microservices'
        ]
    },
    {
        'company': 'DataViz Solutions',
        'position': 'Full Stack Developer',
        'period': 'Mar 2017 - Dec 2019',
        'description': 'Developed data visualization tools and dashboards for business intelligence applications. Worked with front-end and back-end technologies to create responsive and interactive web applications.',
        'achievements': [
            'Created a real-time analytics dashboard used by 50+ enterprise clients',
            'Optimized database queries, improving application response time by 35%',
            'Integrated third-party APIs to enhance data processing capabilities'
        ]
    },
    {
        'company': 'Web Creators Agency',
        'position': 'Junior Web Developer',
        'period': 'Jun 2015 - Feb 2017',
        'description': 'Collaborated with designers and project managers to build websites and web applications for various clients. Responsible for implementing responsive designs and ensuring cross-browser compatibility.',
        'achievements': [
            'Developed over 25 client websites using modern web technologies',
            'Created reusable component library that reduced development time by 20%',
            'Implemented SEO best practices, improving client site rankings'
        ]
    }
]
