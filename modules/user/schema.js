const otpGenerator = require('otp-generator');
const {
  StringType,
  EnumType,
  exportSchema,
  AutoIncrementIdType,
} = require('../../helpers/schema');
const { hashPassword } = require('../../helpers/password');
const { setAutoIncrement } = require('../../helpers/hook');
const { sendMail } = require('../../helpers/mail');
const { Schema } = require('mongoose');

const schemaName = 'User';
const autoIncrementId = 'user_id';
const UserSchema = new Schema(
  {
    [autoIncrementId]: AutoIncrementIdType(),
    username: StringType(false),
    email: StringType(true, true, true, { immutable: true }),
    password: StringType(false),
    fullname: StringType(),
    intro: StringType(),
    session_token: StringType(),
    email_otp: StringType(),
    firebaseToken: StringType(),
    role: EnumType(String, ['inner', 'outsource'], { default: 'inner' }),
    status: EnumType(String, ['a', 'd'], { default: 'd' }),
    public_key: StringType(),
    avatar_url: StringType(),
    friends: [Number],
  },
  {
    timestamps: {
      createdAt: 'create_at',
      updatedAt: 'update_at',
    },
  }
);

setAutoIncrement(UserSchema, schemaName, autoIncrementId);

UserSchema.pre('save', async function (next) {
  if (this.password && this.password !== '') {
    this.password = hashPassword(this.password);
    if (this.isNew || !this.email_otp) {
      const otpCode = otpGenerator.generate(6, {
        digits: true,
        upperCase: true,
        specialChars: false,
        alphabets: true,
      }).toUpperCase();
      this.email_otp = otpCode;
      this.status = 'd';
      let verifyLink = `${process.env.CLIENT_DOMAIN}/auth/active-user?username=${this.username}&email=${this.email}&otp_code=${otpCode}`;
      if (process.env.STAGE === 'localhost') {
        verifyLink = `${process.env.CLIENT_DOMAIN}/auth/active-user?username=${this.username}&email=${this.email}&otp_code=${otpCode}`;
      }
      const emailContent = `
        <div>
          <p>You signed up successfully. Please click the link below or enter the OTP code to active your account:</p>
          <div>OTP: <b style="font-size: 16px">${otpCode}</b></div>
          <div>
            Active link: <a href="${verifyLink}">Active</a>
          </div>
        </div>
      `;
      sendMail(this.email, '[InProject] OTP Code', emailContent)
        .then()
        .catch((error) => {
          console.error(error);
        });
    }
  }
  next();
});

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = exportSchema(schemaName, UserSchema, {
  autoIncrement: autoIncrementId,
});
