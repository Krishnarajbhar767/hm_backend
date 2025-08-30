module.exports = function adminCustomRugNotificationTemplate(formData) {
    console.log("Custom Rug Request Details ->", formData);
    return `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: auto; border:1px solid #ddd; padding: 24px; background-color: #fff;">
        <h2 style="color: #222;">📢 New Custom Rug Request Received!</h2>
        <p style="margin-bottom: 20px;">A new custom rug request has been submitted on <strong>Himalaya Carpets</strong>. Below are the details provided by the client:</p>

        <h3 style="color: #333;">👤 Client Information</h3>
        <p>
            Name: <strong>${formData?.name}</strong><br/>
            Email: <a href="mailto:${formData?.email}" style="color: #333; text-decoration: none;">${formData?.email}</a><br/>
            Phone: ${formData?.phone || "Not provided"}
        </p>

        <h3 style="color: #333; margin-top: 30px;">📏 Size Preferences</h3>
        <p>
            Size Preference: <strong>${formData?.sizePreference}</strong><br/>
            ${formData?.sizePreference === 'custom' ? `
            Custom Width: <strong>${formData?.customWidth}</strong><br/>
            Custom Length: <strong>${formData?.customLength}</strong>
            ` : ''}
        </p>

        <h3 style="color: #333; margin-top: 30px;">🧵 Material Preference</h3>
        <p>
            Materials: <strong>${formData?.material && formData?.material?.length > 0 ? formData?.material.join(', ') : "Not specified"}</strong>
        </p>

        <h3 style="color: #333; margin-top: 30px;">🎨 Color & Design</h3>
        <p>
            Preferred Color Palette: <strong>${formData.colorPalette || "Not specified"}</strong><br/>
            Design Style: <strong>${formData?.designStyle || "Not specified"}</strong><br/>
            Design Ideas: <strong>${formData?.designDescription || "Not specified"}</strong><br/>
            Design Shape: <strong>${formData?.shape || "Not specified"}</strong>
        </p>

        <hr style="margin: 30px 0;" />
        <p style="font-size: 13px; color: #777;">
            This is an automated email notification from <strong>Himalaya Carpets</strong> Admin Panel. Please reach out to the client to discuss their custom rug project.
        </p>
    </div>
    `;
};
