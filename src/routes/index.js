import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import ComponentLoadable from "./Loadable";

import PrivateRoute from "./privateRoute";
import { FirstFreeJob } from "../containers/jobs/postJob/firstFreeJob";

const NewHomeContainer = ComponentLoadable({
  loader: () => import("../containers/home/new-home-template"),
});
const FaqContainer = ComponentLoadable({
  loader: () => import("../containers/faq"),
});
const HowItWorkContainer = ComponentLoadable({
  loader: () => import("../containers/howItWork/index"),
});
const RegisterContainer = ComponentLoadable({
  loader: () => import("../containers/auth/register/index"),
});
const WaitApprovalContainer = ComponentLoadable({
  loader: () => import("../containers/waitApproval"),
});
const ResetContainer = ComponentLoadable({
  loader: () => import("../containers/auth/forgotPass"),
});
const SignInContainer = ComponentLoadable({
  loader: () => import("../containers/auth/signIn/index"),
});
const ContactUsContainer = ComponentLoadable({
  loader: () => import("../containers/contact/index"),
});
const AboutUsContainer = ComponentLoadable({
  loader: () => import("../containers/about-us/index"),
});
const PaymentContainer = ComponentLoadable({
  loader: () => import("../containers/payment/index"),
});
const ChangeContainer = ComponentLoadable({
  loader: () => import("../containers/auth/changePass/index"),
});
const ResetConfirmContainer = ComponentLoadable({
  loader: () => import("../containers/auth/resetConfirm/index"),
});
const PricingContainer = ComponentLoadable({
  loader: () => import("../containers/pricing/index"),
});
const PurchasedContainer = ComponentLoadable({
  loader: () => import("../containers/purchase/index"),
});
const PurchaseFreeWelcome = ComponentLoadable({
  loader: () => import("../containers/purchase/free-purchased"),
});
const BillingContainer = ComponentLoadable({
  loader: () => import("../containers/billing/index"),
});
const MessagesContainer = ComponentLoadable({
  loader: () => import("../containers/messages/index"),
});
const CompleteProfileContainer = ComponentLoadable({
  loader: () => import("../containers/profiles/completeProfile/index"),
});
const CompanyProfile = ComponentLoadable({
  loader: () => import("../containers/profiles/clientProfile/index"),
});
const CompanyProfileview = ComponentLoadable({
  loader: () => import("../containers/profiles/client-profile/index"),
});
const FreelancerProfileContainer = ComponentLoadable({
  loader: () => import("../containers/profiles/freelancerProfile/index"),
});
const FreelancerProfileContainerview = ComponentLoadable({
  loader: () => import("../containers/profiles/worker-profile/index"),
});
const hireFreelancerProfileContainerview = ComponentLoadable({
  loader: () => import("../containers/profiles/hire-worker-profile/index"),
});
const FreelancerEditProfileContainer = ComponentLoadable({
  loader: () => import("../containers/profiles/freelancerEditProfile/index"),
});
const ClientEditProfileContainer = ComponentLoadable({
  loader: () => import("../containers/profiles/clientEditProfile/index"),
});
const DashBoard = ComponentLoadable({
  loader: () => import("../containers/DashBoard/index"),
});
const AccountSettingContainer = ComponentLoadable({
  loader: () => import("../containers/accountSetting/index"),
});
const PostJobContainer = ComponentLoadable({
  loader: () => import("../containers/jobs/postJob/index"),
});
const PostedJobContainer = ComponentLoadable({
  loader: () => import("../containers/jobs/postedjob/index"),
});
const AppliedJobContainer = ComponentLoadable({
  loader: () => import("../containers/jobs/applied-on-job/index"),
});
const editJobContainer = ComponentLoadable({
  loader: () => import("../containers/jobs/editjob/index"),
});
const DashboardWorkContainer = ComponentLoadable({
  loader: () => import("../containers/DashBoardWork/index"),
});
const Error404Container = ComponentLoadable({
  loader: () => import("../containers/Error404/index"),
});
const FollowWorkContainer = ComponentLoadable({
  loader: () => import("../containers/followWork/index"),
});
const JobDetailsHireContainer = ComponentLoadable({
  loader: () => import("../containers/jobs/JobDetailsHire/index"),
});
const JobDetailsWorkContainer = ComponentLoadable({
  loader: () => import("../containers/jobs/JobDetailsWork/index"),
});
const Joblist = ComponentLoadable({
  loader: () => import("../containers/searchWork/updatedlistofjobs/index"),
});
const JobApplicationContainer = ComponentLoadable({
  loader: () => import("../containers/jobs/jobApplication/index"),
});
const FavoritesContainer = ComponentLoadable({
  loader: () => import("../containers/favorites/index"),
});
const SearchWorkContainer = ComponentLoadable({
  loader: () => import("../containers/searchWork/index"),
});
const SearchOfflineContainer = ComponentLoadable({
  loader: () => import("../containers/searchWork/SearchOffline"),
});
const hirepage = ComponentLoadable({
  loader: () => import("../containers/searchWork/hirepage/index"),
});
const jobpage = ComponentLoadable({
  loader: () => import("../containers/searchWork/job/index"),
});
const jobpagelist = ComponentLoadable({
  loader: () => import("../containers/searchWork/joblist/index"),
});
const hirepageworker = ComponentLoadable({
  loader: () => import("../containers/searchWork/developerslist/index"),
});
const PaymentWork = ComponentLoadable({
  loader: () => import("../containers/payment/paymentwork"),
});

const HomeContainer = ComponentLoadable({
  loader: () => import("../containers/home/index"),
});

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={HomeContainer} />
        <Route exact path="/p/default.html" component={HomeContainer} />
        <Route exact path="/home" component={NewHomeContainer} />
        <Route exact path="/smallheader" component={NewHomeContainer} />
        <Route exact path="/how-it-works" component={HowItWorkContainer} />
        <Route exact path="/faq" component={FaqContainer} />
        <Route exact path="/register" component={RegisterContainer} />
        <PrivateRoute
          exact
          path="/wait-approval"
          component={WaitApprovalContainer}
        />
        <Route exact path="/register/:params" component={RegisterContainer} />
        <PrivateRoute exact path="/dashboard" component={DashBoard} />
        <PrivateRoute
          exact
          path="/dashboard-work"
          component={DashboardWorkContainer}
        />
        <Route exact path="/sign-in" component={SignInContainer} />
        <Route exact path="/contact-us" component={ContactUsContainer} />
        <Route exact path="/about-us" component={AboutUsContainer} />
        <Route exact path="/payment-details" component={PaymentContainer} />
        <Route exact path="/forget-password" component={ResetContainer} />
        <Route path="/reset-password" component={ChangeContainer} />
        <Route path="/payment-work" component={PaymentWork} />
        <Route exact path="/pricing" component={PricingContainer} />
        <PrivateRoute exact path="/purchased" component={PurchasedContainer} />
        <PrivateRoute
          exact
          path="/purchased-free"
          component={PurchaseFreeWelcome}
        />
        <PrivateRoute exact path="/billing" component={BillingContainer} />
        <PrivateRoute exact path="/messages/" component={MessagesContainer} />
        <PrivateRoute
          exact
          path="/messages/:id"
          component={MessagesContainer}
        />
        <PrivateRoute
          exact
          path="/complete-profile"
          component={CompleteProfileContainer}
        />
        <PrivateRoute
          exact
          path="/edit-profile"
          component={FreelancerEditProfileContainer}
        />
        <PrivateRoute exact path="/profile-hire" component={CompanyProfile} />
        <Route
          exact
          path="/client-profile/:id"
          component={CompanyProfileview}
        />
        <PrivateRoute
          exact
          path="/profile-edit-client"
          component={ClientEditProfileContainer}
        />
        <PrivateRoute
          exact
          path="/profile-work"
          component={FreelancerProfileContainer}
        />
        <Route
          exact
          path="/work-profile/:id"
          component={FreelancerProfileContainerview}
        />
        <PrivateRoute
          exact
          path="/account-setting"
          component={AccountSettingContainer}
        />
        <PrivateRoute exact path="/post-job" component={PostJobContainer} />
        <PrivateRoute exact path="/post-job/:id" component={PostJobContainer} />
        <PrivateRoute exact path="/wait-approval" component={FirstFreeJob} />
        <PrivateRoute
          exact
          path="/posted-job/:id"
          component={PostedJobContainer}
        />
        <PrivateRoute exact path="/edit-job/:id" component={editJobContainer} />
        <PrivateRoute
          exact
          path="/follow-work"
          component={FollowWorkContainer}
        />
        <PrivateRoute
          exact
          path="/job-details-hire/:id"
          component={JobDetailsHireContainer}
        />
        <PrivateRoute
          exact
          path="/job-details-work/:id"
          component={JobDetailsWorkContainer}
        />
        <PrivateRoute
          exact
          path="/job-application"
          component={JobApplicationContainer}
        />
        <PrivateRoute
          exact
          path="/job-applied/:id"
          component={AppliedJobContainer}
        />
        <PrivateRoute exact path="/favorites" component={FavoritesContainer} />
        <PrivateRoute
          exact
          path="/worker-profile"
          component={FavoritesContainer}
        />
        <PrivateRoute
          exact
          path="/search-work"
          component={SearchWorkContainer}
        />
        <Route
          exact
          path="/search-offline/:keyword"
          component={SearchOfflineContainer}
        />
        <Route exact path="/hire-virtual-assistant" component={hirepage} />
        <Route
          exact
          path="/hire-virtual-assistant/:category/:id"
          component={hirepageworker}
        />
        <Route
          exact
          path="/:combine/:category/:country/:name/:id"
          component={hireFreelancerProfileContainerview}
        />
        <Route exact path="/job" component={jobpage} />
        <Route exact path="/job/:category/:id" component={jobpagelist} />
        <Route
          exact
          path="/job/:category/:title/:country/:name/:id"
          component={JobDetailsWorkContainer}
        />
        {/*<Route exact path="/updatedlist" component={Joblist} />*/}
        <Route component={Error404Container} />
      </Switch>
    );
  }
}
export default Routes;
