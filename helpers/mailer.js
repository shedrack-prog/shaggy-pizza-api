import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'meggie.collier81@ethereal.email',
    pass: '4tR5kx8bZyHGV6nEGe',
  },
});
export const sendVerificationEmailFunction = async (email, name, url) => {
  let testAccount = await nodemailer.createTestAccount();

  let info = await transporter.sendMail({
    from: '"Shaggy Pizza" <<Shaggypizza001@gmail.com>>',
    to: email,
    subject: 'Shaggy Pizza Email verification',
    html: `<div style="max-width:700px;margin-bottom:1rem;display:flex;align-items:center;gap:10px;font-family:Roboto;font-weight:600;color:#3b5998"><img src="https://res.cloudinary.com/dv87xhc8j/image/upload/v1707788305/Pizzas/kpwxfuilq5uakhdn6x7c.webp" alt="" style="width:30px"><span>Action require : Activate your Shaggy account</span></div><div style="padding:1rem 0;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;color:#141823;font-size:17px;font-family:Roboto"><span>Hello ${name}</span><div style="padding:20px 0"><span style="padding:1.5rem 0">You recently created an account on Shaggy Pizza. To complete your registration, please confirm your account.</span></div><a href=${url} style="width:200px;padding:10px 15px;background:#4c649b;color:#fff;text-decoration:none;font-weight:600">Confirm your account</a><br><div style="padding-top:20px"><span style="margin:1.5rem 0;color:#898f9c">Shaggy pizza lets you order any pizza of your choice and bring your loved ones together. Thank you for eating with us.</span></div></div>`,
  });
};

export const sendResetCodeFunction = async (email, name, code) => {
  let testAccount = await nodemailer.createTestAccount();

  let info = await transporter.sendMail({
    from: '"Shaggy Pizza" <<Shaggypizza001@gmail.com>>',
    to: email,
    subject: 'Password Reset Code',
    html: `<div style="max-width:700px;margin-bottom:1rem;display:flex;align-items:center;gap:10px;font-family:Roboto;font-weight:600;color:#3b5998"><img src="https://res.cloudinary.com/dv87xhc8j/image/upload/v1707831465/Pizzas/ihkszkjv2eegfflo7axa.webp" alt="" style="width:30px"><span>Reset your Shaggy Password</span></div><div style="padding:1rem 0;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;color:#141823;font-size:17px;font-family:Roboto"><span>Hello ${name}</span><div style="padding:20px 0"><span style="padding:1.5rem 0">You requested to change your password, Here is your code. </span><p>If you did not request for this kindly ignore. Thanks</p></div><a  style="width:200px;padding:10px 15px;background:#4c649b;color:#fff;text-decoration:none;font-weight:600">${code}</a><br><div style="padding-top:20px"><span style="margin:1.5rem 0;color:#898f9c">Shaggy Pizza lets your order any pizza of your choice and bring your loved one together. Thank you for eating with us. </span></div></div>`,
  });
};

export const sendNotificationToAdmin = async (name) => {
  let testAccount = await nodemailer.createTestAccount();

  let info = await transporter.sendMail({
    from: '"Shaggy Pizza" <<Shaggypizza001@gmail.com>>',
    to: 'sheggypizza@gmail.com',
    subject: 'Total In Stock Alert',
    html: `<div style="max-width:700px;margin-bottom:1rem;display:flex;align-items:center;gap:10px;font-family:Roboto;font-weight:600;color:#3b5998"><img src="https://res.cloudinary.com/dv87xhc8j/image/upload/v1707831465/Pizzas/ihkszkjv2eegfflo7axa.webp" alt="" style="width:30px"><span>Total In Stock Alert</span></div><div style="padding:1rem 0;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;color:#141823;font-size:17px;font-family:Roboto"><span>Hello Admin</span><div style="padding:20px 0"><span style="padding:1.5rem 0">This is to notify you that the ${name} pizza is less than 10 in Stock. Please You need to create more ${name} pizzas.</span><p>Pizza is less in Stock</p></div><a  style="width:200px;padding:10px 15px;background:#4c649b;color:#fff;text-decoration:none;font-weight:600"></a><br><div style="padding-top:20px"><span style="margin:1.5rem 0;color:#898f9c">Shaggy Pizza lets your order any pizza of your choice and bring your loved one together. Thank you for eating with us. </span></div></div>`,
  });
};
