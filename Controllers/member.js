const Member = require('../Modals/member');
const Membership = require('../Modals/membership');

// Helper function to calculate the next bill date based on DAYS
function addDaysToDate(days, joiningDate) {
    let date = new Date(joiningDate);
    date.setDate(date.getDate() + days);
    return date;
}

// --- Dashboard Stats Function ---
exports.getDashboardStats = async (req, res) => {
    try {
        const totalMembers = await Member.countDocuments({ gym: req.gym._id });
        
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthlyJoined = await Member.countDocuments({ 
            gym: req.gym._id,
            createdAt: { $gte: startOfMonth } 
        });

        const sevenDaysFromNow = new Date(new Date().setDate(now.getDate() + 7));
        const expiringSoon = await Member.countDocuments({
            gym: req.gym._id,
            status: 'Active',
            nextBillDate: { $gte: now, $lte: sevenDaysFromNow }
        });

        const expired = await Member.countDocuments({
            gym: req.gym._id,
            status: 'Active',
            nextBillDate: { $lt: now }
        });

        res.status(200).json({
            stats: {
                totalMembers,
                monthlyJoined,
                expiringSoon,
                expired
            },
            userName: req.gym.userName // Send username for greeting
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
};


// 1. Get All Members with Pagination
exports.getAllMember = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const skip = (page - 1) * limit;

        const members = await Member.find({ gym: req.gym._id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
            
        const totalMembers = await Member.countDocuments({ gym: req.gym._id });

        res.status(200).json({
            message: "Fetched members successfully",
            members,
            pagination: {
                total: totalMembers,
                page,
                pages: Math.ceil(totalMembers / limit)
            }
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// 2. Register a New Member
exports.registerMember = async (req, res) => {
    try {
        const { name, mobileNo, address, membership, profilePic, joiningDate } = req.body;

        const existingMember = await Member.findOne({ gym: req.gym._id, mobileNo });
        if (existingMember) {
            return res.status(409).json({ message: 'A member with this mobile number already exists.' });
        }

        const memberShipPlan = await Membership.findOne({ _id: membership, gym: req.gym._id });
        if (!memberShipPlan) {
            return res.status(404).json({ message: "Selected membership plan not found." });
        }

        const nextBillDate = addDaysToDate(memberShipPlan.duration, new Date(joiningDate));

        const newMember = new Member({
            name,
            mobileNo,
            address,
            plan: memberShipPlan.planName,
            profilePic,
            joiningDate: new Date(joiningDate),
            nextBillDate,
            gym: req.gym._id,
            status: 'Active'
        });

        await newMember.save();
        res.status(201).json({ message: "Member registered successfully", member: newMember });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// 3. Search for a Member
exports.searchMember = async (req, res) => {
    try {
        const { q, page = 1, limit = 8 } = req.query;
        const skip = (page - 1) * limit;

        const searchRegex = new RegExp(q, 'i');
        const searchQuery = {
            gym: req.gym._id,
            $or: [
                { name: searchRegex },
                { mobileNo: searchRegex }
            ]
        };

        const members = await Member.find(searchQuery).skip(skip).limit(limit);
        const totalMembers = await Member.countDocuments(searchQuery);

        res.status(200).json({
            message: "Search results fetched",
            members,
            pagination: {
                total: totalMembers,
                page,
                pages: Math.ceil(totalMembers / limit)
            }
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// 4. Get Members who joined this month
exports.monthlyMember = async (req, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        const members = await Member.find({
            gym: req.gym._id,
            createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        }).sort({ createdAt: -1 });

        res.status(200).json(members);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// 5. Get Members expiring in 3 days (Added for compatibility)
exports.expiringWithin3Days = async (req, res) => {
    try {
        const today = new Date();
        const nextThreeDays = new Date(new Date().setDate(today.getDate() + 3));

        const members = await Member.find({
            gym: req.gym._id,
            status: 'Active',
            nextBillDate: { $gte: today, $lte: nextThreeDays }
        });
        res.status(200).json(members);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
};


// 6. Get Members expiring in 4-7 days
exports.expiringWithIn4To7Days = async (req, res) => {
    try {
        const today = new Date();
        const fourDaysFromNow = new Date(new Date().setDate(today.getDate() + 4));
        const sevenDaysFromNow = new Date(new Date().setDate(today.getDate() + 7));

        const members = await Member.find({
            gym: req.gym._id,
            status: 'Active',
            nextBillDate: { $gte: fourDaysFromNow, $lte: sevenDaysFromNow }
        });
        res.status(200).json(members);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// 7. Get Expired Members
exports.expiredMember = async (req, res) => {
    try {
        const today = new Date();
        const members = await Member.find({
            gym: req.gym._id,
            status: 'Active',
            nextBillDate: { $lt: today }
        });
        res.status(200).json(members);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// 8. Get Inactive Members
exports.inActiveMember = async (req, res) => {
    try {
        const members = await Member.find({ gym: req.gym._id, status: 'Inactive' });
        res.status(200).json(members);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// 9. Get Member Details by ID
exports.getMemberDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const member = await Member.findOne({ _id: id, gym: req.gym._id });
        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }
        res.status(200).json(member);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// 10. Change Member Status
exports.changeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        const member = await Member.findOneAndUpdate(
            { _id: id, gym: req.gym._id },
            { status: isActive ? 'Active' : 'Inactive' },
            { new: true }
        );

        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }
        res.status(200).json({ message: "Status updated successfully", member });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// 11. Renew/Update Member Plan
exports.updateMemberPlan = async (req, res) => {
    try {
        const { plan } = req.body;
        const { id } = req.params;

        const memberShipPlan = await Membership.findOne({ gym: req.gym._id, _id: plan });
        if (!memberShipPlan) {
            return res.status(404).json({ message: "Selected membership plan not found." });
        }

        const nextBillDate = addDaysToDate(memberShipPlan.duration, new Date());

        const updatedMember = await Member.findOneAndUpdate(
            { _id: id, gym: req.gym._id },
            {
                plan: memberShipPlan.planName,
                nextBillDate,
                status: 'Active'
            },
            { new: true }
        );

        if (!updatedMember) {
            return res.status(404).json({ message: "Member not found" });
        }
        res.status(200).json({ message: "Membership renewed successfully", member: updatedMember });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
};