# MongoDB Setup Guide

To import your Excel data, you need to set up a MongoDB connection. Here are your options:

## Option 1: Local MongoDB (Recommended for testing)

1. **Install MongoDB locally:**
   - Download from: https://www.mongodb.com/try/download/community
   - Or use Docker: `docker run -d -p 27017:27017 --name mongodb mongo:latest`

2. **Create .env file in project root:**
   ```bash
   # Create .env file
   echo "MONGODB_URL=mongodb://localhost:27017/ihuusa" > .env
   ```

## Option 2: MongoDB Atlas (Cloud)

1. **Create free MongoDB Atlas account:**
   - Go to: https://www.mongodb.com/atlas
   - Create a free cluster

2. **Get your connection string:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

3. **Create .env file:**
   ```bash
   # Replace with your actual connection string
   echo "MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/ihuusa?retryWrites=true&w=majority" > .env
   ```

## Option 3: Use existing MongoDB (if you have one)

If you already have a MongoDB instance running your application:

1. **Find your connection string** from your existing configuration
2. **Create .env file** with the same connection string

## Running the Import

Once you have your MongoDB connection set up:

```bash
# Validate your Excel file (no database needed)
npx tsx src/scripts/validate-custom-excel.ts "src/scripts/newdata.xlsx"

# Import to MongoDB (requires database connection)
npx tsx src/scripts/import-custom-excel.ts "src/scripts/newdata.xlsx"
```

## Your Excel Data Summary

Based on validation, your file contains:
- **81 students** ready for import
- **2 courses**: Certification (80 students), PhD (1 student)
- **Registration numbers**: IHU2501128, IHU2501130, etc.
- **100% valid data** - all rows have required fields

## Troubleshooting

### Connection Issues
- Make sure MongoDB is running
- Check your connection string format
- Ensure network access (for Atlas)

### Import Issues
- The script will skip duplicate registration numbers/emails
- All students will be set to PENDING status
- Default values will be set for missing fields

### Need Help?
- Check the console output for detailed error messages
- The script provides comprehensive logging
- All operations are safe - no existing data will be modified 