if (fromVendor){
  // This step is needed to ensure that nothing else is executed if you're performing a simple GET request. 
  done(transformedObject)
}

if (!fromVendor) {
  // This block is to make sure a POST request is sending data in the right format for the vendor (Hubspot). 
  var emailProperty = {
    "property":"email",
    "value": originalObject.email
  };
  var properties = [emailProperty]
  transformedObject.properties = properties
}

if ((originalObject.hasOwnProperty("properties")) && (fromVendor)) {
  //Finally, this block will determine if data is coming from the vendor and the response has the properties field (a field unique to POST responses).
  //This block will run the POST response through the VDR. 
    transformedObject.email = originalObject.properties.email.value
  }
done(transformedObject)