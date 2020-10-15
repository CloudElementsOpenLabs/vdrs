# VDR Transformation of POST Responses.

This is an example of how you can use JS to force your `POST` **responses** to be transformed through your VDR. Currently you can use the `fromVendor` boolean to determnine if data is coming from the `User` or the `Vendor`. This JS takes that concept a few steps further by returning a `POST` response from the vendor that is not defined in the VDR field mappings, and might not be passed through at all without added logic.

## Example: HubSpot CRM
For example, take the `POST` response HubSpot CRM returns when you `POST` a new contact to `/contacts`:
```
{
  "raw": {
    "isNew": true,
    "vid": 82651
  },
  "vid": 82651
}
```
The field `"raw"` is a field unique to `POST` responses from HubSpot CRM, and can therefore be used to force a response through your VDR. Without custome JS to do this, you would get an empty `{}` response because your VDR does not define the `"raw"` field. Using something similar to the below JS `if` block, you can customize `POST` responses from vendors to fit your needs.
```
if ((originalObject.hasOwnProperty("raw")) && (fromVendor)) {
    transformedObject.id = originalObject.raw.vid;
  }
done(transformedObject);
```

## IMPORTANT NOTES
1. Normally you would use the `fromVendor` boolean to determine if the VDR is transforming a `POST` request or a `GET` response. However, to be able to differentiate between a `GET` response, `POST` Request and `POST` response you need to identify a unqiue field in the `POST` response the vendor returns. This unqiue field will be used to identify if the VDR is transforming a `POST` **request** or a `POST` **response**.
2. You can test this out directly with your own VDR (inputting the JS directly from this file [PostResponsesVDRs.js](PostResponsesVDRs.js) and customize it to fit your needs **or** use the included VDR and Hubspot transformation to play around with the results first. You will need an authenticated instance of HubSpot CRM to do the latter.

### Import in the UI
1. Create the VDRs.
    * Call POST `/organizations/objects/postResponses/definitions` with the payload: [objectDefinition.json](postResponsesVDR/postResponses/definition/objectDefinition.json), where the objectName is `postResponses`. You can find this API [here](https://my-staging.cloudelements.io/api-docs/platform/organizations).
2. Create the transformation for HubSpot CRM.
    * Call POST `/organizations/elements/hubspotcrm/transformations/postResponses` with the payload: [transformation.json](postResponsesVDR/postResponses/transformation/hubspotcrm/transformation.json), where keyOrId is `hubspotcrm` and objectName is `postResponses`.
3. The VDR, transformation, and JS will now be ready for use. Test it out by making a `POST` request with and without the JS.

### Import Using the doctor
1. Ensure you have the correct version of the doctor installed locally. Run the command:
    ```
    npm i -g ce-util
    ```
    This will install the latest, non-beta version of the doctor. You can find full instructions [here](https://www.npmjs.com/package/ce-util) as well, as you might need to add an account if you are not already familiar with the doctor. 
2. Import the VDR and transformation:
    * In the terminal, run `cd postResponsesVDR`, then, from that directory, run:
        ```
        doctor upload vdrs <accountNickName> -d . -n postResponses
        ```
    This will import the VDR as well as the transformation into the account you specify.
    **Note**: If you make changes the the VDR and want to save them locally, you can run `doctor download vdrs <accountsNickName> -n postResponses -d whatYouWantToCallTheNewDirectoryHere` from your terminal to do so.
3. The VDR, transformation, and JS will now be ready for use. Test it out by making a `POST` request with and without the JS.