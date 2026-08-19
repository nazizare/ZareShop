Nazafarin

A full-stack e-commerce web application built with HTML, CSS, JavaScript, and PHP, featuring customer shopping functionality and an admin dashboard.

-Features

Customer Features :
 User registration and login
 Customer account management
 Edit profile
 Change password
 Logout
 Product browsing
 Product details page
 Shopping cart
 Wishlist
 Checkout
 Order creation
 Order history
 Order details
 Order status tracking
 Order success page

Admin Features :
 Admin authentication
 Admin dashboard
 Sales and order statistics
 Product management
 Add, edit, and delete products
 Order management
 Update order status
 Customer management
 View order details
 Delete orders

Technologies :
 HTML5
 CSS3
 JavaScript
 PHP
 MySQL
 LocalStorage
 Git & GitHub

-Project Structure
ZareShop/
│
├── Frontend
│   ├── index.html
│   ├── product.html
│   ├── product.js
│   ├── checkout.html
│   ├── checkout.js
│   ├── success.html
│   ├── success.js
│   ├── wishlist.html
│   ├── wishlist.js
│   ├── script.js
│   └── style.css
│
├── Customer Authentication
│   ├── login.html
│   ├── login.js
│   ├── login.php
│   ├── register.html
│   ├── register.js
│   ├── register.php
│   ├── logout.php
│   ├── customer_logout.php
│   ├── account.html
│   ├── account.js
│   └── change_password.php
│
├── Customer Orders
│   ├── my-orders.html
│   ├── my-orders.js
│   ├── my-order-details.html
│   ├── my-order-details.js
│   ├── customer-order-details.html
│   ├── customer-order-details.js
│   ├── customer_get_orders.php
│   ├── get_customer_orders.php
│   └── get_customer_order.php
│
├── Order Management
│   ├── save_order.php
│   ├── save_customer.php
│   ├── get_order.php
│   ├── get_orders.php
│   ├── get_success_order.php
│   ├── update_order_status.php
│   └── delete_order.php
│
├── Product Management
│   ├── get_products.php
│   ├── get_all_products.php
│   ├── get_product.php
│   ├── get_product_for_admin.php
│   ├── add_product.php
│   ├── update_product.php
│   └── delete_product.php
│
├── Admin Panel
│   ├── admin.html
│   ├── admin.js
│   ├── admin-login.html
│   ├── admin-login.js
│   ├── admin_login.php
│   ├── admin-auth.js
│   ├── admin-header.js
│   ├── admin-sidebar.js
│   ├── admin-dashboard.js
│   ├── admin-products.html
│   ├── admin-products.js
│   ├── admin-orders.html
│   ├── order-details.html
│   ├── order-details.js
│   ├── admin-layout.css
│   ├── check_admin.php
│   ├── require_admin.php
│   └── get_admin_stats.php
│
├── Customer Management
│   ├── get_customers.php
│   └── update_customer.php
│
└── Database
    └── db.php

-------------------------------

-Main Functionalities

 The application uses PHP and MySQL for backend operations such as authentication, customer management, products, orders, and order items.

 JavaScript handles the client-side functionality including cart management, wishlist management, form validation, dynamic product rendering, and communication with the PHP backend using fetch().

 The project also includes a separate admin panel for managing products, customers, and orders.

-Database

The application uses a MySQL database with entities for:
 Customers
 Products
 Orders
 Order Items
 Admins 
 
-Authentication

 Customer authentication is implemented using PHP sessions, password hashing, and login validation.

 Admin authentication is handled separately with protected admin endpoints.

-Purpose

 This project was developed as a practical full-stack web development project to practice frontend development, backend development, database integration, authentication, CRUD operations, and e-commerce workflows.

-------------------------------

-قابلیت‌های اصلی

 این برنامه از PHP و MySQL برای عملیات سمت سرور مانند احراز هویت، مدیریت مشتریان، محصولات، سفارش‌ها و آیتم‌های سفارش استفاده می‌کند.

 JavaScript مسئول قابلیت‌های سمت کاربر از جمله مدیریت سبد خرید، مدیریت لیست علاقه‌مندی‌ها، اعتبارسنجی فرم‌ها، نمایش پویا‌ی محصولات و ارتباط با بک‌اند PHP از طریق fetch() است.

 این پروژه همچنین شامل یک پنل مدیریت (Admin Panel) مجزا برای مدیریت محصولات، مشتریان و سفارش‌ها است.

-پایگاه داده

این برنامه از یک پایگاه داده MySQL با موجودیت‌های زیر استفاده می‌کند:
 Customers
 Products
 Orders
 Order Items
 Admins 
 

-احراز هویت

 احراز هویت مشتریان با استفاده از PHP Session، هش کردن رمز عبور و اعتبارسنجی اطلاعات ورود پیاده‌سازی شده است.

 احراز هویت مدیر به‌صورت جداگانه انجام شده و endpointهای مدیریتی از طریق سیستم دسترسی محافظت می‌شوند.

-هدف پروژه

 این پروژه به‌عنوان یک پروژه عملی توسعه وب Full-Stack با هدف تمرین و پیاده‌سازی مفاهیم توسعه Front-End، توسعه Back-End، اتصال به پایگاه داده، احراز هویت، عملیات CRUD و فرآیندهای مختلف یک فروشگاه اینترنتی توسعه داده شده است.