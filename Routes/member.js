const express = require("express");
const router = express.Router();
const MemberController = require('../Controllers/member');
const { protect } = require('../Auth/auth'); 

// Apply the authentication middleware to all routes in this file
router.use(protect);

// --- NEW Dashboard Route ---
router.get('/dashboard/stats', MemberController.getDashboardStats);

// --- Main Member Routes ---
router.get('/all-member', MemberController.getAllMember);
router.post('/register-member', MemberController.registerMember);
router.get('/searched-members', MemberController.searchMember);
router.get('/details/:id', MemberController.getMemberDetails);

// --- Dashboard/Filtered List Routes ---
router.get('/monthly-joined', MemberController.monthlyMember);
router.get('/expiring-in-3-days', MemberController.expiringWithin3Days);
router.get('/expiring-in-4-to-7-days', MemberController.expiringWithIn4To7Days);
router.get('/expired', MemberController.expiredMember);
router.get('/inactive', MemberController.inActiveMember);

// --- Member Management Routes ---
router.post('/change-status/:id', MemberController.changeStatus);
router.put('/update-member-plan/:id', MemberController.updateMemberPlan);

module.exports = router;