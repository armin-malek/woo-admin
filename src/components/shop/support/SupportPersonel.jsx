import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

const SupportPersonel = ({ info }) => {
  return (
    <>
      <div
        className="col-12 col-sm-10 col-md-5 col-lg-4"
        style={{ zIndex: "1" }}
      >
        <div className="card profile-card-3">
          <div className="background-block">
            <img
              src="img/shaking-hands.png"
              alt="profile-sample1"
              className="background"
            />
          </div>
          <div className="profile-thumb-block">
            <img src={info?.img} alt="profile-image" className="profile" />
          </div>
          <div className="card-content">
            <h2>{info?.name}</h2>
            <div className="icon-block">
              <a
                href={`https://wa.me/${info?.whatsapp}`}
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  src="/icons/whatsapp.png"
                  width={40}
                  height={40}
                  alt="whatsapp logo"
                ></Image>
              </a>
              <a
                href={`https://t.me/${info?.telegram}`}
                target="_blank"
                rel="noreferrer"
              >
                {" "}
                <Image
                  src="/icons/telegram.png"
                  width={35}
                  height={35}
                  alt="telegram logo"
                ></Image>
              </a>
              <a
                href={`mailto:${info?.email}`}
                target="_blank"
                rel="noreferrer"
              >
                {" "}
                <Image
                  src="/icons/envelope.png"
                  width={35}
                  height={35}
                  alt="envelope logo"
                ></Image>
              </a>
            </div>
            <hr />
            <a href={`tel:${info?.mobile}`}>
              <p>{info?.mobile}</p>
            </a>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .sec {
            margin-top: 10%;
            margin-right: 35%;
            width: 100%;
            padding: 30px 0;
          }

          /*Profile Card 3*/
          .profile-card-3 {
            position: relative;
            float: left;
            overflow: hidden;
            width: 100%;
            text-align: center;
            height: 390px;
            border: none;
          }
          .profile-card-3 .background-block {
            float: left;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          .profile-card-3 .background-block .background {
            width: 100%;
            vertical-align: top;
            opacity: 0.9;
            -webkit-filter: blur(0.5px);
            filter: blur(0.5px);
            -webkit-transform: scale(1.8);
            transform: scale(2.8);
          }
          .profile-card-3 .card-content {
            width: 100%;
            padding: 15px 25px;
            color: #232323;
            float: left;
            background: #efefef;
            height: 50%;
            border-radius: 0 0 5px 5px;
            position: relative;
            z-index: 9999;
          }
          .profile-card-3 .card-content::before {
            content: "";
            background: #efefef;
            width: 120%;
            height: 100%;
            left: 11px;
            bottom: 51px;
            position: absolute;
            z-index: -1;
            transform: rotate(-13deg);
          }
          .profile-card-3 .profile {
            border-radius: 50%;
            position: absolute;
            bottom: 50%;
            left: 50%;
            max-width: 100px;
            opacity: 1;
            box-shadow: 3px 3px 20px rgba(0, 0, 0, 0.5);
            border: 2px solid rgba(255, 255, 255, 1);
            -webkit-transform: translate(-50%, 0%);
            transform: translate(-50%, 0%);
            z-index: 99999;
          }
          .profile-card-3 h2 {
            margin: 0 0 5px;
            font-weight: 600;
            font-size: 25px;
          }
          .profile-card-3 h2 small {
            display: block;
            font-size: 15px;
            margin-top: 10px;
          }
          .profile-card-3 i {
            display: inline-block;
            font-size: 16px;
            color: #232323;
            text-align: center;
            border: 1px solid #232323;
            width: 30px;
            height: 30px;
            line-height: 30px;
            border-radius: 50%;
            margin: 0 5px;
          }

          .icon-one {
            margin-left: 90px;
          }

          .icon-two {
            margin-left: 0px;
            margin-top: -42px;
          }
          .icon-three {
            margin-right: 90px;
            margin-top: -42px;
          }
        `}
      </style>
    </>
  );
};

export default SupportPersonel;
