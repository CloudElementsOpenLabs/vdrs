# VDR Transformation of POST Responses.

This is an example of how you can use JS to force your POST responses to be tranformed through your VDR. Currently you can use the 'fromVendor' boolean to determnine if data is coming from the User or the vendor. This JS takes that concept a few steps further. This example was created using an instance of Hubspot CRM. 

Things to note in this example:
1. Normally you would use the fromVendor boolean to determine if the VDR is transforming a POST request or a GET response. However to be able to differentiate between GET response, POST Request and POST response You will need to identify a unqiue field in the POST response. This Unqiue field will be used to identify if the VDR is transforming a POST request or a POST response. In this example, the properties field is unqiue to a POST response from Hubspot. We use that properties field in the following line to determine if it's a POST response:
    * (originalObject.hasOwnProperty("properties"))
2. In this example we're only including the email field as this is only meant to be a proof of concept example. You can add all of the fields that you care about to both the second and third if-blocks. 
