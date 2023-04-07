import { faPlus, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field, Form, useFormikContext } from "formik";
import { useEffect, useState } from "react";

const AdminMarketAddForm = ({ isPosting, provinces }) => {
  const { values, setFieldValue } = useFormikContext();
  const [cities, setCities] = useState();
  const [regions, setRegions] = useState();
  useEffect(() => {
    //console.log("value effect");
    if (values.province) {
      let prov = provinces.find((x) => x.id == values.province);
      //console.log("prov", prov);
      //console.log("values.city", values.city);
      setCities(prov.Cities);
      setFieldValue("city", prov.Cities[0]?.id);

      let city = prov.Cities.find((x) => x.id == prov.Cities[0]?.id);
      //console.log("prov city", prov.Cities);
      //console.log("city", city);
      //console.log("values.city", values.city);
      if (city) {
        setRegions(city.Regions);
        setFieldValue("region", city.Regions[0]?.id);
      } else setRegions();
      //let Regions  =
      //if (parseInt(values.city) >= 0)
    }
  }, [values.province]);

  useEffect(() => {
    // set locations
    if (provinces && provinces.length > 0) {
      setFieldValue("province", provinces[0]?.id);
      setCities(provinces[0]?.Cities);
      setFieldValue("city", provinces[0]?.Cities[0]?.id);

      if (provinces[0]?.Cities[0]?.Regions) {
        setRegions(provinces[0]?.Cities[0]?.Regions);
        setFieldValue("region", provinces[0]?.Cities[0]?.Regions[0]?.id);
      }
    }
  }, []);

  return (
    <Form>
      <div
        className="row justify-content-center"
        style={{ textAlign: "right" }}
      >
        <div className="col-12">
          <div className="form-group">
            <label>نام مالک:</label>
            <Field className="form-control" name="fullName" />
          </div>
          <div className="form-group">
            <label>موبایل مالک:</label>
            <Field className="form-control" name="mobile" />
          </div>
          <div className="form-group">
            <label>نام مارکت:</label>
            <Field className="form-control" name="marketName" />
          </div>
          <div className="form-group">
            <label>استان:</label>
            <Field
              className="form-control"
              name="province"
              as="select"
              //onChange={(e) => console.log("prov", e.target.value)}
            >
              {provinces?.map((item, index) => (
                <option value={item.id} key={index}>
                  {item.name}
                </option>
              ))}
            </Field>
          </div>
          <div className="form-group">
            <label>شهر:</label>
            <Field className="form-control" name="city" as="select">
              {cities?.map((item, index) => (
                <option value={item.id} key={index}>
                  {item.name}
                </option>
              ))}
            </Field>
          </div>
          <div className="form-group">
            <label>منطقه:</label>
            <Field className="form-control" name="region" as="select">
              {regions?.map((items, index) => (
                <option value={items.id} key={index}>
                  {items.name}
                </option>
              ))}
            </Field>
          </div>
          <div className="form-group">
            <label>مختصات:</label>
            <Field className="form-control" name="gpsCordinates" />
          </div>
          <div className="form-group">
            <label>آدرس:</label>
            <Field className="form-control" name="address" as="textarea" />
          </div>

          <div className="row justify-content-center mt-1">
            {isPosting ? (
              <>
                <div className="spinner-border text-primary">
                  <span className="sr-only">در حال انجام ...</span>
                </div>
              </>
            ) : (
              <>
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={isPosting ? true : false}
                >
                  <FontAwesomeIcon
                    icon={faPlus}
                    style={{ width: "20px" }}
                  ></FontAwesomeIcon>
                  <span className="pr-1">ایجاد</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Form>
  );
};
export default AdminMarketAddForm;
