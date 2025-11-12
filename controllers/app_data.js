const supabase = require('../supabaseClient.js');

async function getAppData(req, res) {

    const { data, error } = await supabase
        .from('app_data')
        .select('*')

    if (error) {
        console.error(error);
        return res.status(400).json({success: false, error: "Failed to get App Data", fullError: error});
    }

    return res.status(200).json({success: true, data: data});
}

module.exports = {
    getAppData
}