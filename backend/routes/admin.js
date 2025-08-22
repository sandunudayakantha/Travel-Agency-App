const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Package = require('../models/Package');
const Booking = require('../models/Booking');
const { protect, authorize } = require('../middleware/auth');
const { adminLimiter } = require('../middleware/security');

const router = express.Router();

// All routes require admin access with rate limiting
router.use(protect, authorize('admin'), adminLimiter);

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private/Admin
router.get('/dashboard', async (req, res) => {
  try {
    // User statistics
    const totalUsers = await User.countDocuments();
    const newUsers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    // Package statistics
    const totalPackages = await Package.countDocuments();
    const activePackages = await Package.countDocuments({ status: 'active' });
    const featuredPackages = await Package.countDocuments({ featured: true });

    // Booking statistics
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });

    // Revenue statistics
    const revenueData = await Booking.aggregate([
      { $match: { status: { $in: ['paid', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } }
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    // Monthly revenue for the last 6 months
    const monthlyRevenue = await Booking.aggregate([
      {
        $match: {
          status: { $in: ['paid', 'completed'] },
          createdAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$pricing.total' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Popular destinations
    const popularDestinations = await Package.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$destination',
          count: { $sum: 1 },
          averageRating: { $avg: '$ratings.average' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Recent bookings
    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .populate('package', 'title destination')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          new: newUsers
        },
        packages: {
          total: totalPackages,
          active: activePackages,
          featured: featuredPackages
        },
        bookings: {
          total: totalBookings,
          pending: pendingBookings,
          confirmed: confirmedBookings,
          completed: completedBookings
        },
        revenue: {
          total: totalRevenue,
          monthly: monthlyRevenue
        },
        popularDestinations,
        recentBookings
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard data'
    });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get detailed analytics
// @access  Private/Admin
router.get('/analytics', async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Booking trends
    const bookingTrends = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$pricing.total' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Package category distribution
    const categoryDistribution = await Package.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          averagePrice: { $avg: '$price.amount' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // User registration trends
    const userTrends = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Top performing packages
    const topPackages = await Package.aggregate([
      { $match: { status: 'active' } },
      {
        $lookup: {
          from: 'bookings',
          localField: '_id',
          foreignField: 'package',
          as: 'bookings'
        }
      },
      {
        $addFields: {
          bookingCount: { $size: '$bookings' },
          totalRevenue: {
            $sum: '$bookings.pricing.total'
          }
        }
      },
      { $sort: { bookingCount: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        bookingTrends,
        categoryDistribution,
        userTrends,
        topPackages
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics'
    });
  }
});

// @route   POST /api/admin/packages/:id/feature
// @desc    Toggle package featured status
// @access  Private/Admin
router.post('/packages/:id/feature', async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);

    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    package.featured = !package.featured;
    await package.save();

    res.json({
      success: true,
      message: `Package ${package.featured ? 'featured' : 'unfeatured'} successfully`,
      data: { package }
    });
  } catch (error) {
    console.error('Toggle feature error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while toggling package feature'
    });
  }
});

// @route   POST /api/admin/packages/:id/status
// @desc    Update package status
// @access  Private/Admin
router.post('/packages/:id/status', [
  body('status')
    .isIn(['active', 'inactive', 'draft', 'sold-out'])
    .withMessage('Invalid status')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const package = await Package.findById(req.params.id);

    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    package.status = req.body.status;
    await package.save();

    res.json({
      success: true,
      message: 'Package status updated successfully',
      data: { package }
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating package status'
    });
  }
});

// @route   GET /api/admin/reports
// @desc    Generate reports
// @access  Private/Admin
router.get('/reports', async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    let report = {};

    switch (type) {
      case 'bookings':
        report = await generateBookingReport(start, end);
        break;
      case 'revenue':
        report = await generateRevenueReport(start, end);
        break;
      case 'packages':
        report = await generatePackageReport(start, end);
        break;
      case 'users':
        report = await generateUserReport(start, end);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid report type'
        });
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating report'
    });
  }
});

// Helper functions for report generation
async function generateBookingReport(startDate, endDate) {
  const bookings = await Booking.find({
    createdAt: { $gte: startDate, $lte: endDate }
  }).populate('package', 'title destination');

  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;

  const totalRevenue = bookings
    .filter(b => ['paid', 'completed'].includes(b.status))
    .reduce((sum, b) => sum + b.pricing.total, 0);

  return {
    period: { startDate, endDate },
    totalBookings,
    confirmedBookings,
    completedBookings,
    cancelledBookings,
    totalRevenue,
    bookings
  };
}

async function generateRevenueReport(startDate, endDate) {
  const revenueData = await Booking.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: { $in: ['paid', 'completed'] }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        },
        revenue: { $sum: '$pricing.total' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
  ]);

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalTransactions = revenueData.reduce((sum, item) => sum + item.count, 0);

  return {
    period: { startDate, endDate },
    totalRevenue,
    totalTransactions,
    dailyRevenue: revenueData
  };
}

async function generatePackageReport(startDate, endDate) {
  const packages = await Package.find({
    createdAt: { $gte: startDate, $lte: endDate }
  });

  const categoryStats = await Package.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        averagePrice: { $avg: '$price.amount' }
      }
    }
  ]);

  return {
    period: { startDate, endDate },
    totalPackages: packages.length,
    categoryStats,
    packages
  };
}

async function generateUserReport(startDate, endDate) {
  const users = await User.find({
    createdAt: { $gte: startDate, $lte: endDate }
  });

  const roleStats = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 }
      }
    }
  ]);

  return {
    period: { startDate, endDate },
    totalUsers: users.length,
    roleStats,
    users
  };
}

module.exports = router; 