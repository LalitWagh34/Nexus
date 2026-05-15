import passport from "passport"
import prisma from "./prisma"
import config from "./env"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"

passport.use(
    new GoogleStrategy(
        {
            clientID:config.google.clientId,
            clientSecret:config.google.clientSecret,
            callbackURL:config.google.callbackUrl
        },
        async(accessToken ,refreshToken , profile ,done)=>{
            try{
                const email = profile.emails?.[0]?.value;
                const avatar = profile.photos?.[0]?.value;

                if(!email){
                    return done(new Error("No Email was found from Google profile"))
                }
                let user = await prisma.user.findUnique({
                    where:{email},
                })
                if(!user){
                    user = await prisma.user.create({
                        data:{
                            email,
                            name:profile.displayName,
                            googleId:profile.id,
                            avatar,
                        },
                    });
                }
                if(!user.googleId){
                    user = await prisma.user.update({
                        where:{email},
                        data:{
                            googleId:profile.id ,
                            avatar
                        }
                    })
                }
                return done (null ,user);
            }catch(error){
                return done(error as Error)
            }
        }
    )
)

export default passport;