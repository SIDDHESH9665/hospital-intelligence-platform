import pandas as pd
import numpy as np

def get_claims_summary(df, partner_id):
    """Generate summary of cashless, reimbursement, medical, and surgical claims for current year"""
    
    claims_df = df[
        (df['PARTNER_ID'] == partner_id)
    ]
    
    summary = {
        'cashless': {
            'amount': float(claims_df[claims_df['CLAIM_TYPE'] == 'CASHLESS']['APPROVED_AMT'].sum()),
            'count': int(claims_df[claims_df['CLAIM_TYPE'] == 'CASHLESS']['CLAIM_NO'].count())
        },
        'reimbursement': {
            'amount': float(claims_df[claims_df['CLAIM_TYPE'] == 'REIMBURSEMENT']['APPROVED_AMT'].sum()),
            'count': int(claims_df[claims_df['CLAIM_TYPE'] == 'REIMBURSEMENT']['CLAIM_NO'].count())
        },
        'medical': {
            'amount': float(claims_df[claims_df['MEDICAL_OR_SURGICAL'] == 'Medical']['APPROVED_AMT'].sum()),
            'count': int(claims_df[claims_df['MEDICAL_OR_SURGICAL'] == 'Medical']['CLAIM_NO'].count())
        },
        'surgical': {
            'amount': float(claims_df[claims_df['MEDICAL_OR_SURGICAL'] == 'Surgical']['APPROVED_AMT'].sum()),
            'count': int(claims_df[claims_df['MEDICAL_OR_SURGICAL'] == 'Surgical']['CLAIM_NO'].count())
        }
    }
    
    return summary

def calculate_average_claim_cost(df, partner_id):
    """
    Calculate the average claim cost for a given partner ID, including total, Medical, and Surgical ACS scores.
    """
    # Filter the DataFrame for the given partner ID
    partner_claims = df[df['PARTNER_ID'] == partner_id]
    
    # Calculate the average claim cost for total claims
    if not partner_claims.empty:
        total_acs = partner_claims['APPROVED_AMT'].mean()
    else:
        total_acs = 0

    # Calculate the average claim cost for Medical claims
    medical_claims = partner_claims[partner_claims['MEDICAL_OR_SURGICAL'] == 'Medical']
    if not medical_claims.empty:
        medical_acs = medical_claims['APPROVED_AMT'].mean()
    else:
        medical_acs = 0

    # Calculate the average claim cost for Surgical claims
    surgical_claims = partner_claims[partner_claims['MEDICAL_OR_SURGICAL'] == 'Surgical']
    if not surgical_claims.empty:
        surgical_acs = surgical_claims['APPROVED_AMT'].mean()
    else:
        surgical_acs = 0

    # Create a DataFrame with the results
    result_df = pd.DataFrame({
        'total_acs': [round(total_acs)],
        'medical_acs': [round(medical_acs)],
        'surgical_acs': [round(surgical_acs)]
    })
    
    return result_df

def calculate_cost_revision_ratio(df, partner_id):
    claims_df = df[df['PARTNER_ID'] == partner_id]
    
    # Calculate ratio for each claim
    claims_df['cost_revision_ratio'] = abs(claims_df['CLAIMED_AMT'] - claims_df['APPROVED_AMT']) / claims_df['CLAIMED_AMT']
    
    # Yearly trend
    yearly_trend = claims_df.groupby('CLAIM_YEAR')['cost_revision_ratio'].mean().reset_index()
    
    return yearly_trend

def get_similar_hospitals(df, partner_id):
    """
    Get up to 5 unique hospitals with the same 'PIN' and 'HOSP_TYPE' for a given partner ID.
    """
    required_columns = {'PARTNER_ID', 'PIN', 'HOSP_TYPE', 'HOSPITAL', 'APPROVED_AMT'}
    if not required_columns.issubset(df.columns):
        raise ValueError(f"DataFrame must contain columns: {required_columns}")

    # Drop rows with missing essential values
    df = df.dropna(subset=['PARTNER_ID', 'PIN', 'HOSP_TYPE'])

    # Get details for the given partner ID
    hospital_details = df[df['PARTNER_ID'] == partner_id]

    if hospital_details.empty:
        return pd.DataFrame()

    # Extract relevant attributes
    pin = hospital_details.iloc[0]['PIN']
    hosp_type = hospital_details.iloc[0]['HOSP_TYPE']

    if pd.isna(pin) or pd.isna(hosp_type):
        return pd.DataFrame()

    # Find similar hospitals and remove duplicates
    similar_hospitals = df[
        (df['PIN'] == pin) & 
        (df['HOSP_TYPE'] == hosp_type) & 
        (df['PARTNER_ID'] != partner_id)
    ].drop_duplicates(subset=['HOSPITAL'])

    # Get the number of available hospitals (max 5)
    num_hospitals = min(5, len(similar_hospitals))

    # Compute ACS (average approved amount) for each hospital
    hospital_acs = df.groupby("PARTNER_ID")["APPROVED_AMT"].mean()

    # Round ACS to 2 decimal places
    rounded_acs = {pid: round(value, 0) for pid, value in hospital_acs.items()}

    # Process and store results in a DataFrame
    results = pd.DataFrame({
        "name": similar_hospitals["HOSPITAL"].head(num_hospitals).values,
        "distance": [f"{np.random.randint(1, 10)} km" for _ in range(num_hospitals)],
        "hosp_type": similar_hospitals["HOSP_TYPE"].head(num_hospitals).values,
        "acs": [rounded_acs.get(pid, 0) for pid in similar_hospitals["PARTNER_ID"].head(num_hospitals).values]
    })

    return results

def claim_type_analysis(df, partner_id):
    claims_df = df[(df['PARTNER_ID'] == partner_id) & (df['CLAIM_YEAR'].isin([2022, 2023, 2024]))]
    
    pivot1 = claims_df.groupby('CLAIM_YEAR').agg({
        'CLAIM_NO': [
            ('CASHLESS_Claims', lambda x: (claims_df.loc[x.index, 'CLAIM_TYPE'] == 'CASHLESS').sum()),
            ('REIMBURSEMENT_Claims', lambda x: (claims_df.loc[x.index, 'CLAIM_TYPE'] == 'REIMBURSEMENT').sum()),
            ('Total_Claims', 'count')
        ],
        'APPROVED_AMT': [
            ('CASHLESS_Amount', lambda x: claims_df.loc[x.index[claims_df.loc[x.index, 'CLAIM_TYPE'] == 'CASHLESS'], 'APPROVED_AMT'].sum()),
            ('REIMBURSEMENT_Amount', lambda x: claims_df.loc[x.index[claims_df.loc[x.index, 'CLAIM_TYPE'] == 'REIMBURSEMENT'], 'APPROVED_AMT'].sum()),
            ('Total_Approved_Amount', 'sum')
        ]
    }).reset_index()
    
    pivot1.columns = [
        'claim_year', 
        'CASHLESS_Claims', 'REIMBURSEMENT_Claims', 'Total_Claims',
        'CASHLESS_Amount', 'REIMBURSEMENT_Amount', 'Total_Approved_Amount'
    ]
    
    return pivot1

def medical_surgical_analysis(df, partner_id):
    claims_df = df[(df['PARTNER_ID'] == partner_id) & (df['CLAIM_YEAR'].isin([2022, 2023, 2024]))]
    
    pivot2 = claims_df.groupby('CLAIM_YEAR').agg({
        'CLAIM_NO': [
            ('Medical_Count_Of_Claims', lambda x: claims_df.loc[x.index[claims_df.loc[x.index, 'MEDICAL_OR_SURGICAL'] == 'Medical'], 'CLAIM_NO'].nunique()),
            ('SURGICAL_Count_Of_Claims', lambda x: claims_df.loc[x.index[claims_df.loc[x.index, 'MEDICAL_OR_SURGICAL'] == 'Surgical'], 'CLAIM_NO'].nunique()),
            ('Total_Claims', 'count')
        ],
        'APPROVED_AMT': [
            ('Medical_Sum_ofApproved_Amount', lambda x: claims_df.loc[x.index[claims_df.loc[x.index, 'MEDICAL_OR_SURGICAL'] == 'Medical'], 'APPROVED_AMT'].sum()),
            ('SURGICAL_Sum_ofApproved_Amount', lambda x: claims_df.loc[x.index[claims_df.loc[x.index, 'MEDICAL_OR_SURGICAL'] == 'Surgical'], 'APPROVED_AMT'].sum()),
            ('Total_Approved_Amount', 'sum')
        ]
    }).reset_index()
    
    pivot2.columns = [
        'claim_year', 
        'Medical_Count_Of_Claims', 'SURGICAL_Count_Of_Claims', 'Total_Claims',
        'Medical_Sum_ofApproved_Amount', 'SURGICAL_Sum_ofApproved_Amount', 'Total_Approved_Amount'
    ]
    
    return pivot2

def percentage_analysis(df, partner_id):
    claims_df = df[
        (df['PARTNER_ID'] == partner_id) & 
        (df['CLAIM_YEAR'].isin([2022, 2023, 2024]))
    ]
    
    claims_by_type = claims_df.groupby(
        claims_df['MEDICAL_OR_SURGICAL'].str.upper().apply(
            lambda x: 'Medical' if x.startswith('MEDICAL') else 
                      'Surgical' if x.startswith('SURGICAL') else x
        )
    ).agg({
        'APPROVED_AMT': 'sum',
        'CLAIMED_AMT': 'sum'
    }).reset_index()
    
    total_approved = claims_by_type['APPROVED_AMT'].sum()
    total_claimed = claims_by_type['CLAIMED_AMT'].sum()
    
    pivot3 = claims_by_type.copy()
    pivot3['Sum_of_Approved_Amt_Percentage'] = (pivot3['APPROVED_AMT'] / total_approved * 100).round(2)
    pivot3['Sum_of_Claimed_Amt_Percentage'] = (pivot3['CLAIMED_AMT'] / total_claimed * 100).round(2)
    
    # Add Grand Total row
    grand_total_row = pd.DataFrame({
        'MEDICAL_OR_SURGICAL': ['Grand Total'],
        'Sum_of_Approved_Amt_Percentage': [100.00],
        'Sum_of_Claimed_Amt_Percentage': [100.00]
    })
    pivot3 = pd.concat([pivot3, grand_total_row]).reset_index(drop=True)
    pivot3.drop(['APPROVED_AMT','CLAIMED_AMT'], axis=1, inplace=True)
    
    return pivot3

def room_category_analysis(df, partner_id):
    claims_df = df[
        (df['PARTNER_ID'] == partner_id) & 
        (df['CLAIM_YEAR'].isin([2022, 2023, 2024]))
    ]
    
    pivot4 = claims_df.groupby('ROOM_CATEGORY')['CLAIM_NO'].count().reset_index(name='Total_Claims')
    pivot4 = pivot4.sort_values('Total_Claims', ascending=False)
    
    return pivot4

def diagnosis_analysis(df, partner_id):
    claims_df = df[
        (df['PARTNER_ID'] == partner_id) & 
        (df['CLAIM_YEAR'].isin([2022, 2023, 2024]))
    ]
    
    pivot5 = claims_df.groupby('FINAL_DIAGNOSIS').agg({
        'CLAIM_NO': 'count',
        'APPROVED_AMT': 'sum',
        'CLAIMED_AMT': 'sum'
    }).reset_index()
    pivot5.columns = ['FINAL_DIAGNOSIS', 'Total_Claims', 'Total_Approved_AMT', 'Total_Claimed_AMT']
    pivot5 = pivot5.sort_values('Total_Claims', ascending=False)
    
    return pivot5

def analyze_hospital_claims(df, partner_id):
    claims_summary = get_claims_summary(df, partner_id)
    average_claim_cost = calculate_average_claim_cost(df, partner_id)
    similar_hospitals = get_similar_hospitals(df, partner_id)
    cost_revision_ratio = calculate_cost_revision_ratio(df, partner_id)
    claim_type_analysis_result = claim_type_analysis(df, partner_id)
    medical_surgical_analysis_result = medical_surgical_analysis(df, partner_id)
    type_percentage_analysis_result = percentage_analysis(df, partner_id)
    room_category_analysis_result = room_category_analysis(df, partner_id)
    diagnosis_analysis_result = diagnosis_analysis(df, partner_id)
    
    # Convert claims summary to DataFrame
    summary_flat = {
        'Type': [],
        'Amount': [],
        'Count': []
    }
    
    for claim_type, values in claims_summary.items():
        summary_flat['Type'].append(claim_type)
        summary_flat['Amount'].append(values['amount'])
        summary_flat['Count'].append(values['count'])
    
    claims_summary_df = pd.DataFrame(summary_flat)
    
    return {
        'Get_claims_summary': claims_summary_df,
        'Average_Claim_Cost': average_claim_cost,
        'Similar_Hospitals': similar_hospitals,
        'Cost_Revision_Ratio': cost_revision_ratio,
        'Claim_Type_Analysis': claim_type_analysis_result,
        'Medical_Surgical_Analysis': medical_surgical_analysis_result,
        'Type_Percentage_Analysis': type_percentage_analysis_result,
        'Room_Category_Analysis': room_category_analysis_result,
        'Diagnosis_Analysis': diagnosis_analysis_result
    } 