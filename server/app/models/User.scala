package models
import scala.concurrent.Future

import javax.inject.{ Inject, Singleton }
import play.api.db.slick.DatabaseConfigProvider
import slick.driver.JdbcProfile
import scala.concurrent.{ Future, ExecutionContext }
import java.util.UUID

case class User(val uuid : UUID, val oauthID : String)

class UserDAO @Inject() (dbConfigProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext) {
  private val dbConfig = dbConfigProvider.get[JdbcProfile]
  import dbConfig._
  import driver.api._

  private val Users = TableQuery[UserTable]

  def insert(user: User): Future[Unit] = db.run(Users += user).map { _ => () }



  private class UserTable(tag: Tag) extends driver.api.Table[User](tag, "user") {
    def uuid = column[UUID]("uuid", O.PrimaryKey) // This is the primary key column
    def oauth_id = column[String]("oauth_id")
    // Every table needs a * projection with the same type as the table's type parameter
    def * = (uuid, oauth_id) <> (User.tupled, User.unapply _)
  }
}
