import React, { useState, useEffect, useCallback } from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  PDFDownloadLink,
  Font,
  Image,
  Svg,
  Path,
  Defs,
  Stop
} from '@react-pdf/renderer';
import { Dialog, DialogContent, Button, DialogActions, IconButton, DialogTitle, Typography, Box, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Building2, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { loadAllImages, BASE64_IMAGES } from '../../../utils/imageUtils';

// Register fonts
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.cdnfonts.com/s/29107/Helvetica.woff', fontWeight: 400 },
    { src: 'https://fonts.cdnfonts.com/s/29107/Helvetica-Bold.woff', fontWeight: 700 }
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    fontSize: 100,
    color: '#f0f0f0',
    opacity: 0.3,
  },
  header: {
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  logo: {
    width: 80,
    height: 30,
    objectFit: 'contain',
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
    marginLeft: 4,
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 6,
  },
  hospitalInfo: {
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  hospitalMeta: {
    flexDirection: 'row',
    marginTop: 2,
    flexWrap: 'wrap',
  },
  metaItem: {
    fontSize: 10,
    color: '#6b7280',
    marginRight: 16,
  },
  hospitalAddress: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 2,
  },
  dateText: {
    fontSize: 10,
    color: '#6b7280',
  },
  section: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 4,
  },
  scoreSection: {
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 20,
  },
  scoreDisplay: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    marginTop: 4,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e3a8a',
    textAlign: 'center',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 2,
  },
  scoreRatingText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 4,
  },
  scoreContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f97316',  // Orange border
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  progressStrip: {
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    marginTop: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  checkpointContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkpointIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  checkpointText: {
    fontSize: 10,
    color: '#4b5563',
  },
  scoreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  scoreItem: {
    width: '50%',
    padding: 8,
  },
  scoreItemInner: {
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 4,
  },
  checkpointGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 16,
  },
  checkpointItem: {
    width: '48%',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
  },
  checkpointHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkpointLogo: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  summarySection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 10,
    color: '#4b5563',
    lineHeight: 1.4,
  },
  gaugeContainer: {
    position: 'relative',
    width: 280,
    height: 160,
    alignSelf: 'center',
    marginBottom: 24,
    backgroundColor: '#ffffff',
    padding: 4,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  gaugeScore: {
    position: 'absolute',
    bottom: '8%',
    left: '50%',
    transform: 'translate(-50%, 0)',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    padding: '8px 12px',
    borderRadius: 8,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  
  scoreNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  scoreDenominator: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 2,
  },
  
  scoreRating: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },

  accreditationGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    padding: 16,
  },

  accreditationItem: {
    width: '48%',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  accreditationLogo: {
    width: 40,
    height: 40,
    objectFit: 'contain',
    marginTop: 4,
  },

  accreditationContent: {
    flex: 1,
  },

  accreditationTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 4,
  },

  accreditationStatus: {
    fontSize: 10,
    borderRadius: 4,
    padding: '4px 8px',
  },

  financialGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    padding: 16,
  },

  financialItem: {
    width: '48%',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  financialLogo: {
    width: 24,
    height: 24,
    objectFit: 'contain',
    marginRight: 8,
  },

  legalGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    padding: 16,
  },

  legalLogo: {
    width: 32,
    height: 32,
    objectFit: 'contain',
  },

  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 12,
  },
  
  gridItem: {
    width: '48%',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  
  itemLogo: {
    width: 24,
    height: 24,
    objectFit: 'contain',
    marginRight: 8,
  },
  
  itemContent: {
    flex: 1,
    flexDirection: 'column',
  },
  
  itemTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 4,
  },
  
  itemStatus: {
    fontSize: 9,
    color: '#6b7280',
    padding: '2px 6px',
    borderRadius: 4,
    marginBottom: 4,
  },
  
  observationText: {
    fontSize: 9,
    color: '#4b5563',
    lineHeight: 1.3,
  },
  
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 0.5,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
  },
  
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  footerText: {
    fontSize: 6,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  
  trademark: {
    fontSize: 6,
    color: '#9ca3af',
    fontStyle: 'italic',
    textTransform: 'uppercase',
  },
  
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 40,
    fontSize: 8,
    color: '#9ca3af',
  },

  validStatus: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },

  invalidStatus: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },

  detailedSummary: {
    fontSize: 9,
    color: '#4b5563',
    lineHeight: 1.3,
    marginTop: 4,
  },
});

const ReportDocument = ({ hospital, images }) => {
  // Update defaultHospitalData to include PMJAY and ROHINI
  const defaultHospitalData = {
    hospital_info: {
      HOSPITAL: 'N/A',
      CATEGORY: 'N/A',
      TIER: 'N/A',
      ID: 'N/A',
      ADDRESS: 'N/A'
    },
    hospital_score: {
      score: 0,
      financial_score: 0,
      legal_score: 0,
      accreditation_score: 0,
      detailed_observations: ''
    },
    financial_assessment: {
      pan: { 
        status: 'invalid', 
        observations: 'PAN verification pending. Required for tax compliance and financial transactions.' 
      },
      gst: { 
        status: 'invalid', 
        observations: 'GST registration status needs verification. Important for billing and tax purposes.' 
      },
      epfo: { 
        status: 'invalid', 
        observations: 'EPFO compliance check pending. Employee benefits and statutory requirements to be verified.' 
      }
    },
    negative_legal: {
      blacklist: { 
        severity: 'High', 
        observations: 'Blacklist status check pending. Critical for credibility assessment.' 
      },
      pmjay: { 
        status: 'invalid', 
        observations: 'PMJAY empanelment status pending. Required for government healthcare scheme participation.' 
      },
      legal_status: {
        criminal_case: { 
          status: 'No Data', 
          observations: 'Criminal case history check pending. Essential for legal compliance verification.' 
        },
        civil_case: { 
          status: 'No Data', 
          observations: 'Civil case history check pending. Important for risk assessment.' 
        }
      }
    },
    accreditation_status: {
      jci: { 
        status: 'Not Available', 
        label: 'JCI',
        observations: 'JCI accreditation status not available.' 
      },
      nabh: { 
        status: 'Not Available', 
        label: 'NABH',
        observations: 'NABH accreditation status not available.' 
      },
      rohini: { 
        status: 'Not Available', 
        label: 'ROHINI',
        observations: 'ROHINI registration status not available.' 
      }
    }
  };

  // Merge provided hospital data with default values
  const safeHospital = {
    ...defaultHospitalData,
    ...hospital,
    hospital_info: { ...defaultHospitalData.hospital_info, ...(hospital?.hospital_info || {}) },
    hospital_score: { ...defaultHospitalData.hospital_score, ...(hospital?.hospital_score || {}) },
    financial_assessment: { ...defaultHospitalData.financial_assessment, ...(hospital?.financial_assessment || {}) },
    negative_legal: {
      ...defaultHospitalData.negative_legal,
      ...(hospital?.negative_legal || {}),
      legal_status: {
        ...defaultHospitalData.negative_legal.legal_status,
        ...(hospital?.negative_legal?.legal_status || {})
      }
    },
    accreditation_status: { ...defaultHospitalData.accreditation_status, ...(hospital?.accreditation_status || {}) }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return '#22c55e';  // Green for 8.5 and above
    if (score >= 70) return '#3b82f6';  // Blue
    if (score >= 60) return '#f59e0b';  // Orange
    return '#ef4444';  // Red
  };

  const getRatingInfo = (score) => {
    if (score >= 85) return { text: 'Excellent', color: '#22c55e' };  // Green for 8.5 and above
    if (score >= 70) return { text: 'Good', color: '#3b82f6' };
    if (score >= 60) return { text: 'Average', color: '#f59e0b' };
    return { text: 'Needs Improvement', color: '#ef4444' };
  };

  const renderGauge = (score) => {
    const percentage = score;
    const { text: ratingText, color: ratingColor } = getRatingInfo(score);

    return (
      <View style={styles.gaugeContainer}>
        <Svg viewBox="0 0 100 100">
          {/* Background arc - larger and more centered */}
          <Path
            d={`M 10 70 A 40 40 0 0 1 90 70`}
            stroke="#f3f4f6"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
          />
          {/* Score arc - matches background size */}
          <Path
            d={`M 10 70 A 40 40 0 0 1 ${10 + (80 * percentage / 100)} 70`}
            stroke={ratingColor}
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
          />
        </Svg>
        <View style={styles.gaugeScore}>
          <Text style={[styles.scoreNumber, { color: ratingColor }]}>
            {(score / 10).toFixed(1)}
            <Text style={styles.scoreDenominator}>/10</Text>
          </Text>
          <Text style={[styles.scoreRating, { color: ratingColor }]}>
            {ratingText}
          </Text>
        </View>
      </View>
    );
  };

  const getCheckpointStatus = (value, threshold) => {
    return value >= threshold;
  };

  const renderCheckpoint = (label, isChecked) => (
    <View style={styles.checkpointContainer}>
      {isChecked ? (
        <CheckCircle style={[styles.checkpointIcon, { color: '#22c55e' }]} />
      ) : (
        <XCircle style={[styles.checkpointIcon, { color: '#ef4444' }]} />
      )}
      <Text style={styles.checkpointText}>{label}</Text>
    </View>
  );

  const renderProgressStrip = (value, max = 100) => {
    const percentage = (value / max) * 100;
    return (
      <View style={styles.progressStrip}>
        <View 
          style={[
            styles.progressFill, 
            { 
              width: `${percentage}%`,
              backgroundColor: getScoreColor(percentage)
            }
          ]} 
        />
      </View>
    );
  };

  const generateSummary = (hospital) => {
    const score = hospital?.hospital_score?.score || 0;
    
    let summary = '';
    
    // Overall Assessment
    summary += `Executive Assessment:\n`;
    summary += `${hospital?.hospital_info?.HOSPITAL || 'The hospital'} has achieved an overall due diligence score of ${(score/10).toFixed(1)}/10. `;
    
    // Financial Status
    const financialStatus = Object.values(hospital?.financial_assessment || {}).map(item => {
      if (item.observations) return `• ${item.observations}`;
    }).filter(Boolean).join('\n');
    
    summary += `\n\nFinancial Overview:\n${financialStatus}`;
    
    // Legal & Compliance Status
    const legalStatus = [
      hospital?.negative_legal?.blacklist?.observations,
      hospital?.negative_legal?.pmjay?.observations,
      hospital?.negative_legal?.legal_status?.criminal_case?.observations,
      hospital?.negative_legal?.legal_status?.civil_case?.observations
    ].filter(Boolean).map(obs => `• ${obs}`).join('\n');
    
    summary += `\n\nLegal & Compliance Overview:\n${legalStatus}`;
    
    // Accreditation Status
    const accreditationStatus = Object.values(hospital?.accreditation_status || {}).map(item => {
      if (item.observations) return `• ${item.observations}`;
    }).filter(Boolean).join('\n');
    
    summary += `\n\nAccreditation Overview:\n${accreditationStatus}`;
    
    // Business Decision Recommendation
    summary += '\n\nBusiness Recommendation:\n';
    if (score >= 80) {
      summary += '• Highly recommended for partnership. Strong compliance and operational standards demonstrated.\n';
      summary += '• Minimal risk profile with robust documentation and certifications.\n';
      summary += '• Suggested for fast-track onboarding process.';
    } else if (score >= 70) {
      summary += '• Recommended for partnership with standard due diligence.\n';
      summary += '• Moderate risk profile with minor compliance gaps to be addressed.\n';
      summary += '• Regular monitoring of improvement areas advised.';
    } else if (score >= 60) {
      summary += '• Conditional recommendation pending improvements.\n';
      summary += '• Higher risk profile requiring enhanced due diligence.\n';
      summary += '• Specific improvement targets should be set and monitored.';
    } else {
      summary += '• Not recommended for immediate partnership.\n';
      summary += '• Significant compliance and documentation gaps identified.\n';
      summary += '• Major improvements required before reconsideration.';
    }
    
    return summary;
  };

  const renderScoreSection = (score, observations) => {
    const { text: ratingText, color: ratingColor } = getRatingInfo(score);
    const scoreColor = score >= 85 ? '#22c55e' : ratingColor; // Green for 8.5 and above
    
    return (
      <View style={styles.scoreSection}>
        <Text style={styles.sectionTitle}>Hospital Score</Text>
        <View style={[
          styles.scoreContainer,
          { borderColor: `${scoreColor}40` }  // Adding 40 for 25% opacity
        ]}>
          <View style={styles.greenStrip} />
          <View style={styles.scoreDisplay}>
            <Text style={[styles.scoreValue, { color: scoreColor }]}>
              {(score / 10).toFixed(1)}<Text style={styles.scoreLabel}>/10</Text>
            </Text>
            <Text style={[styles.scoreRatingText, { color: scoreColor }]}>{ratingText}</Text>
          </View>
        </View>
        <View style={styles.progressStrip}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${score}%`,
                backgroundColor: scoreColor
              }
            ]} 
          />
        </View>
        {observations && (
          <View style={styles.detailedObservations}>
            <Text style={styles.observationText}>{observations}</Text>
          </View>
        )}
      </View>
    );
  };

  const getStatusStyle = (status) => {
    if (status === 'valid') return styles.validStatus;
    if (status === 'Not Available') return { backgroundColor: '#f3f4f6', color: '#6b7280' };
    return styles.invalidStatus;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src={images?.logo} style={styles.logo} />
          <View style={styles.headerContent}>
            <Text style={styles.reportTitle}>Hospital Due Diligence Report</Text>
            <View style={styles.hospitalInfo}>
              <Text style={styles.hospitalName}>{safeHospital.hospital_info.HOSPITAL}</Text>
              <View style={styles.hospitalMeta}>
                <Text style={styles.metaItem}>Category: {safeHospital.hospital_info.CATEGORY}</Text>
                <Text style={styles.metaItem}>Tier: {safeHospital.hospital_info.TIER}</Text>
                <Text style={styles.metaItem}>ID: {safeHospital.hospital_info.ID}</Text>
              </View>
              <Text style={styles.hospitalAddress}>{safeHospital.hospital_info.ADDRESS}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.dateText}>Report Generated:</Text>
            <Text style={styles.dateText}>{new Date().toLocaleDateString()}</Text>
          </View>
        </View>

        {renderScoreSection(safeHospital.hospital_score.score, safeHospital.hospital_score.detailed_observations)}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Assessment</Text>
          <View style={styles.gridContainer}>
            <View style={styles.financialItem}>
              <Image src={images?.gst} style={styles.financialLogo} />
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>GST Status</Text>
                <Text style={[
                  styles.itemStatus,
                  safeHospital.financial_assessment.gst.status === 'valid' ? styles.validStatus : styles.invalidStatus
                ]}>
                  {safeHospital.financial_assessment.gst.status.toUpperCase()}
                </Text>
                <Text style={styles.detailedSummary}>
                  {safeHospital.financial_assessment.gst.observations}
                </Text>
              </View>
            </View>
            <View style={styles.financialItem}>
              <Image src={images?.pan} style={styles.financialLogo} />
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>PAN Verification</Text>
                <Text style={[
                  styles.itemStatus,
                  safeHospital.financial_assessment.pan.status === 'valid' ? styles.validStatus : styles.invalidStatus
                ]}>
                  {safeHospital.financial_assessment.pan.status.toUpperCase()}
                </Text>
                <Text style={styles.detailedSummary}>
                  {safeHospital.financial_assessment.pan.observations}
                </Text>
              </View>
            </View>
            <View style={styles.financialItem}>
              <Image src={images?.epfo} style={styles.financialLogo} />
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>EPFO Compliance</Text>
                <Text style={[
                  styles.itemStatus,
                  safeHospital.financial_assessment.epfo.status === 'valid' ? styles.validStatus : styles.invalidStatus
                ]}>
                  {safeHospital.financial_assessment.epfo.status.toUpperCase()}
                </Text>
                <Text style={styles.detailedSummary}>
                  {safeHospital.financial_assessment.epfo.observations}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <Text style={styles.trademark}>© {new Date().getFullYear()} Hospital Due Diligence. All Rights Reserved.</Text>
            <Text style={styles.trademark}>CONFIDENTIAL - For Internal Use Only</Text>
          </View>
        </View>
        
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `Page ${pageNumber} of ${totalPages}`
        )} fixed />
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={[styles.section, { marginTop: 0 }]}>
          <Text style={styles.sectionTitle}>Legal Status & Compliance</Text>
          <View style={styles.gridContainer}>
            <View style={styles.gridItem}>
              <Image src={images?.case} style={styles.itemLogo} />
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>Blacklist Status</Text>
                <Text style={[
                  styles.itemStatus,
                  safeHospital.negative_legal.blacklist.severity.toLowerCase() === 'low' ? styles.validStatus : styles.invalidStatus
                ]}>
                  Severity: {safeHospital.negative_legal.blacklist.severity}
                </Text>
                <Text style={styles.observationText}>{safeHospital.negative_legal.blacklist.observations}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <Image src={images?.pmjay} style={styles.itemLogo} />
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>PMJAY Status</Text>
                <Text style={[
                  styles.itemStatus,
                  safeHospital.negative_legal.pmjay.status === 'valid' ? styles.validStatus : styles.invalidStatus
                ]}>
                  {safeHospital.negative_legal.pmjay.status.toUpperCase()}
                </Text>
                <Text style={styles.observationText}>{safeHospital.negative_legal.pmjay.observations}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <Image src={images?.criminal} style={styles.itemLogo} />
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>Criminal Cases</Text>
                <Text style={[
                  styles.itemStatus,
                  safeHospital.negative_legal.legal_status.criminal_case.status.toLowerCase() === 'no cases' ? styles.validStatus : styles.invalidStatus
                ]}>
                  {safeHospital.negative_legal.legal_status.criminal_case.status || 'None'}
                </Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <Image src={images?.civil} style={styles.itemLogo} />
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>Civil Cases</Text>
                <Text style={[
                  styles.itemStatus,
                  safeHospital.negative_legal.legal_status.civil_case.status.toLowerCase() === 'no cases' ? styles.validStatus : styles.invalidStatus
                ]}>
                  {safeHospital.negative_legal.legal_status.civil_case.status || 'None'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accreditation & Certifications</Text>
          <View style={styles.gridContainer}>
            <View style={styles.gridItem}>
              <Image src={images?.nabh} style={styles.accreditationLogo} />
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>NABH Status</Text>
                <Text style={[
                  styles.itemStatus,
                  getStatusStyle(safeHospital.accreditation_status.nabh.status)
                ]}>
                  {safeHospital.accreditation_status.nabh.status}
                </Text>
                <Text style={styles.observationText}>{safeHospital.accreditation_status.nabh.observations}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <Image src={images?.rohini} style={styles.accreditationLogo} />
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>ROHINI Status</Text>
                <Text style={[
                  styles.itemStatus,
                  getStatusStyle(safeHospital.accreditation_status.rohini.status)
                ]}>
                  {safeHospital.accreditation_status.rohini.status}
                </Text>
                <Text style={styles.observationText}>{safeHospital.accreditation_status.rohini.observations}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <Image src={images?.jci} style={styles.accreditationLogo} />
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>JCI Status</Text>
                <Text style={[
                  styles.itemStatus,
                  getStatusStyle(safeHospital.accreditation_status.jci.status)
                ]}>
                  {safeHospital.accreditation_status.jci.status}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Executive Summary</Text>
          <Text style={styles.summaryText}>{generateSummary(safeHospital)}</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <Text style={styles.trademark}>© {new Date().getFullYear()} Hospital Due Diligence. All Rights Reserved.</Text>
            <Text style={styles.trademark}>CONFIDENTIAL - For Internal Use Only</Text>
          </View>
        </View>
        
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `Page ${pageNumber} of ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  );
};

const ReportGenerator = ({ hospital }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [base64Images, setBase64Images] = useState(BASE64_IMAGES);

  useEffect(() => {
    const loadImages = async () => {
      try {
        setIsLoading(true);
        const images = await loadAllImages();
        if (images) {
          setBase64Images(images);
        }
      } catch (error) {
        console.error('Failed to load images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (open) {
      loadImages();
    }
  }, [open]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (!hospital) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          className="w-full sm:w-auto"
          sx={{
            minWidth: '120px',
            px: 4,
            py: 2,
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
            }
          }}
        >
          {isLoading ? 'Loading...' : 'View Report'}
        </Button>
        <PDFDownloadLink
          document={<ReportDocument hospital={hospital} images={base64Images} />}
          fileName={`${hospital.hospital_info.HOSPITAL.replace(/\s+/g, '_')}_Report_${new Date().toISOString().split('T')[0]}.pdf`}
          className="w-full sm:w-auto"
        >
          {({ loading }) => (
            <Button
              variant="outlined"
              color="primary"
              disabled={loading || isLoading}
              sx={{
                minWidth: '120px',
                px: 4,
                py: 2
              }}
            >
              {loading || isLoading ? 'Preparing...' : 'Download Report'}
            </Button>
          )}
        </PDFDownloadLink>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen
        PaperProps={{
          sx: {
            margin: { xs: 0, sm: 2 },
            width: { xs: '100%', sm: '800px' },
            height: { xs: '100%', sm: '1000px' },
            maxWidth: { xs: '100%', sm: '95vw' },
            maxHeight: { xs: '100%', sm: '95vh' },
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
          }}
        >
          <Typography component="div" variant="h6">
            Hospital Due Diligence Report
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Box>
        
        <DialogContent 
          sx={{ 
            p: 0, 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden',
            height: { xs: 'calc(100% - 64px)', sm: '100%' }
          }}
        >
          {isLoading ? (
            <Box 
              sx={{ 
                width: '100%', 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <PDFViewer
              style={{
                width: '100%',
                height: '100%',
                border: 'none'
              }}
            >
              <ReportDocument hospital={hospital} images={base64Images} />
            </PDFViewer>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportGenerator;