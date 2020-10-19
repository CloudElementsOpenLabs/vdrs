if (fromVendor) {
  // Demonstrates getting from Sales Force (keys) and transforming to common object (values)
  let getPick = {
    'Web': 'Online',
    'Phone Inquiry': 'Phone',
    'Partner Referral': 'Referral',
    'Purchased List': 'List',
    'Other': 'Unknown'
    
  };
  transformedObject.leadSource = getPick[originalObject.LeadSource];
} else {
    // Define one to many mapping
    // Demonstrates posting to common object (keys) and transfoming to Sales Force (values)
    let postPick = {
      'Online': 'Web',
      'Phone': 'Phone Inquiry',
      'Referral': 'Partner Referral',
      'List': 'Purchased List',
      'Event': 'Purchased List',
      'Unknown': 'Other'
    };
  transformedObject.LeadSource = postPick[originalObject.leadSource];
  }
  done(transformedObject);