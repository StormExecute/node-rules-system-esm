const debugIntegrateFunctionality = !!process.argv.filter(el => el == "--debugI").length || process.env.debugI;

export default debugIntegrateFunctionality;