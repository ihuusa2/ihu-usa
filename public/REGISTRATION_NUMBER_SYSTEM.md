# IHU Registration Number System

## Overview
The International Hindu University (IHU) registration number system generates unique identifiers for student registrations with the following format:

**Format**: `IHUYYXXXXX`

Where:
- `IHU` = Fixed prefix for International Hindu University
- `YY` = Last 2 digits of the current year (e.g., 25 for 2025)
- `XXXXX` = Unique 5-digit running number starting from 01177

## Current Implementation (Starting from IHU2501177)

The system has been updated to start fresh from **IHU2501177** onwards, where:
- **25** = Year 2025
- **01177** = Starting sequence number (1177)

## Examples

### 2025 Registrations (Starting Fresh)
- First registration: `IHU2501177` ✅
- Second registration: `IHU2501178` ✅
- Third registration: `IHU2501179` ✅
- ...continuing...
- Registration: `IHU2501199` ✅
- Registration: `IHU2501200` ✅
- Registration: `IHU2501201` ✅

### 2026 Registrations (Sequence Continues, Year Changes)
- First registration in 2026: `IHU2601202` ✅ (continues from 1201)
- Second registration in 2026: `IHU2601203` ✅
- Third registration in 2026: `IHU2601204` ✅

## Key Features

1. **Fresh Start from 01177**: All new registrations start from sequence 01177 (1177)
2. **Sequential Across Years**: The running number continues sequentially across years
3. **Unique Identification**: Each registration number is unique and never repeats
4. **Year-Based Prefix**: The year digits help identify when the registration was created
5. **5-Digit Sequence**: The running number is always 5 digits, padded with leading zeros

## Implementation Details

### Functions Used
- `generateRegistrationNumber(year, sequenceNumber)`: Generates a registration number for a specific year and sequence
- `getNextRegistrationNumber(year, existingNumbers)`: Finds the next available registration number by analyzing existing numbers
- `parseRegistrationNumber(registrationNumber)`: Validates and parses registration numbers

### Database Integration
The system automatically:
1. Checks existing registration numbers in the database
2. Finds the highest sequence number across all years
3. Ensures the next number is at least 01177 (1177)
4. Generates the next sequential number
5. Assigns it to new registrations

### Migration Strategy
- **Fresh Start**: All new registrations use the IHU2501177+ format
- **Existing Data**: Previous registration numbers are preserved as historical data
- **No Conflicts**: The system can handle both old and new format numbers simultaneously

## Registration Number Format

The system generates registration numbers in the format: **IHU{YY}{MM}{XXX}**

### Expected Format Examples
```
First registration: IHU2501177 ✅
Second registration: IHU2501178 ✅
Third registration: IHU2501179 ✅
Next year (2026): IHU2601180 ✅
```

## Usage

When a new registration form is submitted:
1. The system checks for existing registration numbers in the database
2. Finds the highest sequence number across all years
3. Ensures the next number is at least 01177 (1177)
4. Generates the next sequential number
5. Creates the registration number with current year (e.g., IHU2501177)
6. Saves it to the database

This ensures that every new registration gets a unique, sequential number starting from IHU2501177 as requested. 