const blogDataValidation = ({ title, textBody }) => {
  return new Promise((resolve, reject) => {
    if (!title || !textBody) return reject("Missing Blog Data");
    if (typeof title !== "string") return reject("Title is not a text");
    if (typeof textBody !== "string") return reject("TextBody is not a text");

    title = title.trim();
    textBody = textBody.trim();

    if (title.length === 0)
      return reject("Title cannot be an empty string or whitespace.");
    if (textBody.length === 0)
      return reject("TextBody cannot be an empty string or whitespace.");

    
    if (title.length < 3 || title.length > 100)
      return reject("Title length should be 3-100");
    if (textBody.length < 3 || textBody.length > 1000)
      return reject("TextBody length should be 3-1000");

    resolve();
  });
};

module.exports = { blogDataValidation };
