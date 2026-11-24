
import Report from '../models/Report.js';

import {
  generateBirthChart,
  generateKundliMatching,
  generatePanchang,
} from '../services/astrologyService.js';

const saveReport = async (userId, reportType, inputDetails, reportData) => {
  return Report.create({
    userId,
    reportType,
    inputDetails,
    reportData,
  });
};

const handleApiError = (res, error) => {
  const status = error.response?.status;

  return res.status(
    status === 429 ? 429 :
    status === 422 || status === 400 ? status : 502
  ).json({
    success: false,
    message:
      error.response?.data?.detail ||
      error.response?.data?.error ||
      error.message ||
      'Astrology service unavailable',
  });
};

// Generate Birth Chart
export const birthChart = async (req, res) => {
  try {
    const { date, time, place, latitude, longitude, timezone } = req.body;

    if (
      !date || !time || !place ||
      latitude === undefined ||
      longitude === undefined ||
      timezone === undefined ||
      !Number.isFinite(Number(latitude)) ||
      !Number.isFinite(Number(longitude)) ||
      !Number.isFinite(Number(timezone))
    ) {
      return res.status(400).json({
        success: false,
        message: 'Complete and valid birth details are required',
      });
    }

    const inputDetails = {
      date, time, place,
      latitude: Number(latitude),
      longitude: Number(longitude),
      timezone: Number(timezone),
    };

    const data = await generateBirthChart(inputDetails);

    const report = await saveReport(
      req.user._id,
      'BIRTH_CHART',
      inputDetails,
      data
    );

    return res.status(201).json({
      success: true,
      message: 'Birth chart generated successfully',
      report,
    });
  } catch (error) {
    return handleApiError(res, error);
  }
};

// Generate Kundli Matching
export const kundliMatching = async (req, res) => {
  try {
    const { boy_birth_details, girl_birth_details } = req.body;

    const validateBirth = (person) => {
      if (!person) return false;

      return (
        typeof person.date === 'string' &&
        typeof person.time === 'string' &&
        Number.isFinite(Number(person.latitude)) &&
        Number.isFinite(Number(person.longitude)) &&
        Number.isFinite(Number(person.timezone))
      );
    };

    if (
      !validateBirth(boy_birth_details) ||
      !validateBirth(girl_birth_details)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Valid birth details for both persons are required',
      });
    }

    const inputDetails = {
      boy_birth_details,
      girl_birth_details,
    };

    const data = await generateKundliMatching(inputDetails);

    const report = await saveReport(
      req.user._id,
      'KUNDLI_MATCHING',
      inputDetails,
      data
    );

    return res.status(201).json({
      success: true,
      message: 'Kundli matching generated successfully',
      report,
    });
  } catch (error) {
    return handleApiError(res, error);
  }
};

// Generate Panchang
export const panchang = async (req, res) => {
  try {
    const { date, place, latitude, longitude, timezone } = req.body;

    if (
      !date ||
      latitude === undefined ||
      longitude === undefined ||
      timezone === undefined ||
      !Number.isFinite(Number(latitude)) ||
      !Number.isFinite(Number(longitude)) ||
      !Number.isFinite(Number(timezone))
    ) {
      return res.status(400).json({
        success: false,
        message: 'Date, coordinates and timezone are required',
      });
    }

    const inputDetails = {
      date,
      place: place || '',
      latitude: Number(latitude),
      longitude: Number(longitude),
      timezone: Number(timezone),
    };

    const data = await generatePanchang(inputDetails);

    const report = await saveReport(
      req.user._id,
      'PANCHANG',
      inputDetails,
      data
    );

    return res.status(201).json({
      success: true,
      message: 'Panchang generated successfully',
      report,
    });
  } catch (error) {
    return handleApiError(res, error);
  }
};

// Get logged-in user's reports
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find({
      userId: req.user._id,
    })
      .select('-reportData')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single report
export const getReportById = async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    return res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid report ID',
    });
  }
};

// Delete report
export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Report deleted successfully',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid report ID',
    });
  }
};
