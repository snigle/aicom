package controllers

import javax.inject._
import java.util.UUID
import play.api._
import play.api.mvc._
import play.api.libs.ws._
import play.api.libs.json._

import scala.concurrent.Future
import scala.concurrent.ExecutionContext

import models.UserDAO
import models.User
import play.api.db.slick.DatabaseConfigProvider

@Singleton
class AuthController @Inject()(val ws : WSClient, implicit val context: ExecutionContext, val dbConfigProvider: DatabaseConfigProvider) extends Controller {
def dao = new UserDAO(dbConfigProvider)

  def authenticate = Action.async(play.api.mvc.BodyParsers.parse.json) { implicit request =>
    val token = (request.body \ "token").asOpt[String]
    val service = (request.body \ "service").asOpt[String]
    (token,service) match {
      case (Some(token),Some("google")) => authWithGoogle(token)
      case _ => Future(BadRequest("Bad parameters"))
    }
  }

  def authWithGoogle(token : String) : Future[Result] = {
    ws.url("https://www.googleapis.com/oauth2/v3/tokeninfo")
      .withQueryString("access_token" -> token).get()
      .flatMap(response => {
        (response.json \ "aud").asOpt[String] match {
          case Some(id) => login(id).map(token => Ok(Json.toJson(Map("token" -> token))))
          case _ => Future(Forbidden("Fail to authenticate"))
        }
      })
  }

  def login(id : String) : Future[String] = {
    val user : User = User(UUID.randomUUID(),id)
    dao.insert(user).map(_=>"generated token")
  }
}
