<?php
// auth.php already required before this file
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Bus Reservation - Admin</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Bootstrap & Font Awesome -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>

    <style>
        body{
            background:#f5f7fb;
            font-family: system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        }
        .admin-layout{
            min-height:100vh;
            display:flex;
        }
        .sidebar{
            width:240px;
            background:#ffffff;
            border-right:1px solid #e2e8f0;
            padding:1.5rem 1rem;
            position:sticky;
            top:0;
            height:100vh;
        }
        .sidebar .logo{
            font-weight:700;
            font-size:1.2rem;
            margin-bottom:2rem;
            display:flex;
            align-items:center;
            gap:.5rem;
        }
        .avatar-circle{
            width:32px;
            height:32px;
            border-radius:50%;
            background:#2563eb;
            display:flex;
            align-items:center;
            justify-content:center;
            color:#fff;
            font-size:1rem;
        }
        .sidebar .nav-link{
            display:flex;
            align-items:center;
            gap:.75rem;
            color:#4b5563;
            padding:.55rem .9rem;
            border-radius:.8rem;
            margin-bottom:.15rem;
            font-weight:500;
            font-size:.92rem;
        }
        .sidebar .nav-link i{
            width:18px;
        }
        .sidebar .nav-link:hover,
        .sidebar .nav-link.active{
            background:#e5edff;
            color:#2563eb;
        }

        .topbar{
            padding:1rem 1.5rem .5rem 1.5rem;
            display:flex;
            align-items:center;
            justify-content:space-between;
        }
        .topbar-search{
            max-width:380px;
            flex:1;
            margin-right:1.5rem;
        }
        .topbar-search input{
            border-radius:999px;
            border:1px solid #e5e7eb;
            padding-left:2.4rem;
        }
        .topbar-search .fa-magnifying-glass{
            position:absolute;
            left:14px;
            top:50%;
            transform:translateY(-50%);
            color:#9ca3af;
            font-size:.9rem;
        }
        .topbar-profile{
            display:flex;
            align-items:center;
            gap:.75rem;
        }
        .topbar-profile .avatar-lg{
            width:38px;
            height:38px;
            border-radius:50%;
            background:#f97373;
            display:flex;
            align-items:center;
            justify-content:center;
            color:#fff;
            font-weight:600;
        }
        .main-content{
            padding:1rem 1.5rem 2rem 1.5rem;
        }

        /* dashboard cards */
        .stat-card{
            border-radius:1rem;
            border:none;
            padding:1.1rem 1.25rem;
        }
        .stat-label{
            font-size:.82rem;
            color:#6b7280;
        }
        .stat-value{
            font-size:1.6rem;
            font-weight:700;
            margin-top:.2rem;
        }
        .badge-soft{
            font-size:.78rem;
            border-radius:999px;
            padding:.15rem .6rem;
        }
        .stat-blue{background:linear-gradient(145deg,#e0ecff,#f5f7ff);}
        .stat-purple{background:linear-gradient(145deg,#ece4ff,#f6f3ff);}
        .stat-green{background:linear-gradient(145deg,#dcfce7,#f0fff4);}
        .stat-orange{background:linear-gradient(145deg,#ffedd5,#fff7ed);}
        .stat-pink{background:linear-gradient(145deg,#ffe4f0,#fff1f7);}

        .chip-icon{
            width:32px;
            height:32px;
            border-radius:50%;
            display:flex;
            align-items:center;
            justify-content:center;
            color:#fff;
            font-size:.9rem;
        }
        .chip-blue{background:#60a5fa;}
        .chip-green{background:#34d399;}
        .chip-purple{background:#a855f7;}
        .chip-orange{background:#fb923c;}
    </style>
</head>
<body>
<div class="admin-layout">
    <!-- LEFT SIDEBAR -->
    <aside class="sidebar">
        <div class="logo">
            <div class="avatar-circle"><i class="fa-solid fa-bus"></i></div>
            <span>BusReservation</span>
        </div>

        <?php $current = basename($_SERVER['PHP_SELF']); ?>

        <nav class="nav flex-column">
            <a href="index.php"
               class="nav-link <?php echo $current==='index.php'?'active':''; ?>">
                <i class="fa-solid fa-gauge"></i> <span>Dashboard</span>
            </a>
            <a href="buses.php"
               class="nav-link <?php echo $current==='buses.php'?'active':''; ?>">
                <i class="fa-solid fa-bus-simple"></i> <span>Buses</span>
            </a>
            <a href="routes.php"
               class="nav-link <?php echo $current==='routes.php'?'active':''; ?>">
                <i class="fa-solid fa-route"></i> <span>Routes</span>
            </a>
            <a href="trips.php"
               class="nav-link <?php echo $current==='trips.php'?'active':''; ?>">
                <i class="fa-regular fa-calendar-check"></i> <span>Trips</span>
            </a>
            <a href="bookings.php"
               class="nav-link <?php echo $current==='bookings.php'?'active':''; ?>">
                <i class="fa-solid fa-ticket"></i> <span>Bookings</span>
            </a>
            <a href="users.php"
               class="nav-link <?php echo $current==='users.php'?'active':''; ?>">
                <i class="fa-solid fa-user-group"></i> <span>Users</span>
            </a>
            <a href="offers.php"
               class="nav-link <?php echo $current==='offers.php'?'active':''; ?>">
                <i class="fa-solid fa-tags"></i> <span>Offers</span>
            </a>
            <a href="payments.php"
               class="nav-link <?php echo $current==='payments.php'?'active':''; ?>">
                <i class="fa-solid fa-credit-card"></i> <span>Payments</span>
            </a>
            <!-- extra menu items if you later create pages -->
            <!--
            <a href="tracking.php" class="nav-link"><i class="fa-solid fa-location-dot"></i> <span>Tracking</span></a>
            -->
        </nav>
    </aside>

    <!-- RIGHT SIDE (TOPBAR + CONTENT) -->
    <div class="flex-grow-1">
        <!-- TOP BAR -->
        <header class="topbar">
            <div class="topbar-search position-relative">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input type="text" class="form-control"
                       placeholder="Search bookings, users...">
            </div>
            <div class="topbar-profile">
                <i class="fa-regular fa-bell"></i>
                <div class="avatar-lg">
                    <?php echo strtoupper(substr($_SESSION['admin_name'] ?? 'A',0,1)); ?>
                </div>
                <div>
                    <div class="fw-semibold"><?php echo htmlspecialchars($_SESSION['admin_name']); ?></div>
                    <div class="text-muted" style="font-size:.78rem;">Super Admin</div>
                </div>
                <a href="logout.php" class="btn btn-sm btn-outline-secondary ms-2">Logout</a>
            </div>
        </header>

        <!-- PAGE CONTENT START -->
        <main class="main-content">
