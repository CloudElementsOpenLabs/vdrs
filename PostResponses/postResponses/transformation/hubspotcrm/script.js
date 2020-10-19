if ((originalObject.hasOwnProperty("raw")) && (fromVendor)) {
  /*
    This block will format POST responses that cannot be transfomed through the VDR. For example, HubSpot returns the following in
      a POST response:
  
  {
    "raw": {
      "isNew": true,
      "vid": 82601
    },
    "vid": 82601
  }
  
    As the VDR does not have these fields defined, you can instead tell the VDR that if the response is fromVendor AND the response contains "raw" (a field that is unique to POST responses for HubSpot), to format the response however you'd like. Below is taking the "vid" from HubSpot's "raw" response and saving it to be returned as "id".
  */
  
  transformedObject.id = originalObject.raw.vid;
  done(transformedObject);
}

if (fromVendor){
  // Using this if block, the response from the vendor can be manipulated via code. The if block is only needed if you need to differentiate between data that is coming/going to the vendor and the response from those vendor calls.
  done(transformedObject);
}

if (!fromVendor) {
  // This block is to make sure a POST request is sending data in the right format for the vendor.
  // You can customize what is being sent in a POST request here, or add more logic that might be needed for complex payloads.
  done(transformedObject);
}