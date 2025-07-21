import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

import { getBlogImagesSummary, fixBlogsWithInvalidImages } from '../src/Server/Blogs';

async function main() {
    console.log('🔍 Checking current blog images...\n');
    
    try {
        // Get current image summary
        const imageSummary = await getBlogImagesSummary();
        
        console.log('📊 Current Blog Images Summary:');
        console.log('================================');
        
        imageSummary.forEach((blog, index) => {
            const status = blog.isValid ? '✅ Valid' : '❌ Invalid';
            console.log(`${index + 1}. ${blog.title}`);
            console.log(`   Image: ${blog.image}`);
            console.log(`   Status: ${status}\n`);
        });
        
        const validCount = imageSummary.filter(blog => blog.isValid).length;
        const totalCount = imageSummary.length;
        
        console.log(`📈 Summary: ${validCount}/${totalCount} blogs have valid images\n`);
        
        if (validCount < totalCount) {
            console.log('🔧 Running image fix...\n');
            
            const result = await fixBlogsWithInvalidImages();
            console.log(`✅ Fixed ${result.updated} blogs with invalid images\n`);
            
            // Get updated summary
            const updatedSummary = await getBlogImagesSummary();
            const updatedValidCount = updatedSummary.filter(blog => blog.isValid).length;
            
            console.log('📊 Updated Blog Images Summary:');
            console.log('================================');
            
            updatedSummary.forEach((blog, index) => {
                const status = blog.isValid ? '✅ Valid' : '❌ Invalid';
                console.log(`${index + 1}. ${blog.title}`);
                console.log(`   Image: ${blog.image}`);
                console.log(`   Status: ${status}\n`);
            });
            
            console.log(`📈 Final Summary: ${updatedValidCount}/${totalCount} blogs have valid images`);
        } else {
            console.log('✅ All blogs already have valid images!');
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

main().catch(console.error); 