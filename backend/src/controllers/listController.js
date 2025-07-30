
const List = require('../models/List');
const Agent = require('../models/Agent');
const asyncHandler = require('express-async-handler');
const multer = require('multer');
const csv = require('csv-parser');
const ExcelJS = require('exceljs');
const { Readable } = require('stream');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        console.log('File upload attempt:', file.originalname, file.mimetype);
        console.log('File fieldname:', file.fieldname);
        console.log('File buffer:', file.buffer ? 'Buffer exists' : 'No buffer');
        
        const allowedMimes = [
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];
        if (allowedMimes.includes(file.mimetype)) {
            console.log('File type accepted');
            cb(null, true);
        } else {
            console.log('Invalid file type:', file.mimetype);
            cb(new Error('Invalid file type. Only CSV, XLS, and XLSX are allowed.'), false);
        }
    }
});

const validateCsvFormat = (data) => {
    const expectedHeaders = ['firstname', 'phone', 'notes'];
    const actualHeaders = Object.keys(data[0] || {}).map(h => h.toLowerCase());

    const hasAllHeaders = expectedHeaders.every(header => actualHeaders.includes(header));
    if (!hasAllHeaders) {
        return { isValid: false, message: `Missing required CSV headers. Expected: ${expectedHeaders.join(', ')}` };
    }

    for (const row of data) {
        const phoneNumber = row.phone || row.Phone;
        if (!phoneNumber || String(phoneNumber).trim() === '') {
            return { isValid: false, message: `Phone number cannot be empty in CSV.` };
        }
        if (!row.notes || String(row.notes).trim() === '') {
            return { isValid: false, message: `Notes cannot be empty in CSV.` };
        }
        const phoneNumberRegex = /^\+[1-9]\d{1,14}$/;
        if (!phoneNumberRegex.test(String(phoneNumber))) {
            return { isValid: false, message: `Invalid phone number format for: ${phoneNumber}. Must be in E.164 format (e.g., +1234567890).` };
        }
    }

    return { isValid: true };
};

const validateXlsxFormat = (worksheet) => {
    const expectedHeaders = ['firstname', 'phone', 'notes'];
    const headerRow = worksheet.getRow(1);
    const actualHeaders = headerRow.values.filter(Boolean).map(h => typeof h === 'object' ? h.text : h.toString().toLowerCase());

    const hasAllHeaders = expectedHeaders.every(header => actualHeaders.includes(header.toLowerCase()));
    if (!hasAllHeaders) {
        return { isValid: false, message: `Missing required XLSX headers. Expected: ${expectedHeaders.join(', ')}` };
    }

    for (let i = 2; i <= worksheet.rowCount; i++) {
        const row = worksheet.getRow(i);
        const headerMap = {};
        actualHeaders.forEach((header, index) => {
            headerMap[header] = index + 1;
        });

        const rowData = {
            firstname: row.getCell(headerMap['firstname']).value,
            phone: row.getCell(headerMap['phone']).value,
            notes: row.getCell(headerMap['notes']).value,
        };

        if (!rowData.phone) {
            return { isValid: false, message: `Phone number cannot be empty in XLSX at row ${i}.` };
        }
        if (!rowData.notes) {
            return { isValid: false, message: `Notes cannot be empty in XLSX at row ${i}.` };
        }
        const phoneNumberRegex = /^\+[1-9]\d{1,14}$/;
        if (!phoneNumberRegex.test(String(rowData.phone))) {
            return { isValid: false, message: `Invalid phone number format for: ${rowData.phone} at row ${i}. Must be in E.164 format (e.g., +1234567890).` };
        }
    }

    return { isValid: true };
};


const uploadAndDistributeList = async (req, res) => {
    try {
        console.log('Upload request received');
        console.log('Request headers:', req.headers);
        console.log('Request body:', req.body);
        console.log('File:', req.file);
        console.log('User:', req.user);
        
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized, only admin can upload lists.' });
        }
        const uploadedByUserId = req.user._id;

        const fileBuffer = req.file.buffer;
        const mimetype = req.file.mimetype;
        let items = [];

        if (mimetype === 'text/csv') {
            const results = [];
            
            try {
                const stream = Readable.from(fileBuffer);
                
                await new Promise((resolve, reject) => {
                    stream
                        .pipe(csv())
                        .on('data', (data) => results.push(data))
                        .on('end', () => {
                            const validationResult = validateCsvFormat(results);
                            if (!validationResult.isValid) {
                                return reject(new Error(validationResult.message));
                            }
                            items = results;
                            resolve();
                        })
                        .on('error', (error) => reject(error));
                });
            } catch (csvError) {
                console.error('CSV parsing error:', csvError);
                return res.status(400).json({ message: `Error parsing CSV file: ${csvError.message}` });
            }
        } else if (mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || mimetype === 'application/vnd.ms-excel') {
            try {
                const workbook = new ExcelJS.Workbook();
                await workbook.xlsx.load(fileBuffer);
                const worksheet = workbook.getWorksheet(1);

                if (!worksheet) {
                    return res.status(400).json({ message: 'No worksheet found in the Excel file.' });
                }

                const validationResult = validateXlsxFormat(worksheet);
                if (!validationResult.isValid) {
                    return res.status(400).json({ message: validationResult.message });
                }

                worksheet.eachRow((row, rowNumber) => {
                    if (rowNumber === 1) return;
                    const headerRow = worksheet.getRow(1);
                    const actualHeaders = headerRow.values.filter(Boolean).map(h => typeof h === 'object' ? h.text : h.toString().toLowerCase());

                    const rowData = {
                        firstname: row.getCell(actualHeaders.indexOf('firstname') + 1).value,
                        phone: row.getCell(actualHeaders.indexOf('phone') + 1).value,
                        notes: row.getCell(actualHeaders.indexOf('notes') + 1).value,
                    };
                    if (rowData.phone && rowData.notes) {
                        items.push(rowData);
                    }
                });
            } catch (excelError) {
                console.error('Excel parsing error:', excelError);
                return res.status(400).json({ message: `Error parsing Excel file: ${excelError.message}` });
            }
        } else {
            return res.status(400).json({ message: 'Unsupported file type.' });
        }

        if (items.length === 0) {
            return res.status(400).json({ message: 'No valid data found in the uploaded file after parsing.' });
        }

        const agents = await Agent.find({}).limit(5);
        console.log('Found agents:', agents.length);

        if (agents.length < 5) {
            return res.status(400).json({
                message: `Not enough agents (${agents.length}) registered to distribute to 5 agents. Please ensure at least 5 agents exist.`,
            });
        }

        const numberOfAgentsToDistribute = 5;
        const totalItems = items.length;
        const itemsPerAgent = Math.floor(totalItems / numberOfAgentsToDistribute);
        let currentItemIndex = 0;

        const distributedLists = Array.from({ length: numberOfAgentsToDistribute }, () => []);

        for (let i = 0; i < numberOfAgentsToDistribute; i++) {
            for (let j = 0; j < itemsPerAgent; j++) {
                distributedLists[i].push(items[currentItemIndex]);
                currentItemIndex++;
            }
        }

        while (currentItemIndex < totalItems) {
            for (let i = 0; i < numberOfAgentsToDistribute && currentItemIndex < totalItems; i++) {
                distributedLists[i].push(items[currentItemIndex]);
                currentItemIndex++;
            }
        }

        const savedListsDetails = [];

        for (let i = 0; i < numberOfAgentsToDistribute; i++) {
            const agent = agents[i];
            const itemsForAgent = distributedLists[i].map(item => ({
                firstname: item.firstname,
                phone: item.phone,
                notes: item.notes,
                assignedAgent: agent._id,
                uploadedBy: uploadedByUserId,
            }));

            if (itemsForAgent.length > 0) {
                try {
                    console.log('Attempting to insert items for agent:', agent.name);
                    console.log('Items to insert:', itemsForAgent);
                    const result = await List.insertMany(itemsForAgent);
                    console.log('Successfully inserted items:', result.length);
                    savedListsDetails.push({
                        agentId: agent._id,
                        agentName: agent.name,
                        count: result.length,
                    });
                } catch (error) {
                    console.error('Error inserting items for agent:', agent.name, error);
                    throw error;
                }
            }
        }

        res.status(200).json({
            message: 'File uploaded, validated, distributed, and saved successfully.',
            totalItemsProcessed: totalItems,
            distributedDetails: savedListsDetails,
        });

    } catch (error) {
        console.error('Unexpected error in uploadAndDistributeList:', error);
        return res.status(500).json({ 
            message: 'An unexpected error occurred while processing the file',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


const getDistributedLists = asyncHandler(async (req, res) => {
    try {
        console.log('getDistributedLists called');
        console.log('User:', req.user);
        
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view distributed lists.' });
        }

        console.log('Fetching lists from database...');
        const lists = await List.find({}).populate('assignedAgent', 'name email phone').lean();
        console.log('Found lists:', lists.length);

        const groupedLists = {};
        lists.forEach(item => {
            const agentId = item.assignedAgent ? item.assignedAgent._id.toString() : 'unassigned';
            if (!groupedLists[agentId]) {
                groupedLists[agentId] = {
                    agent: item.assignedAgent || null,
                    items: []
                };
            }
            groupedLists[agentId].items.push(item);
        });

        const result = Object.values(groupedLists);
        console.log('Returning grouped lists:', result.length);

        res.status(200).json(result);
    } catch (error) {
        console.error('Error in getDistributedLists:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = {
    upload,
    uploadAndDistributeList,
    getDistributedLists,
};