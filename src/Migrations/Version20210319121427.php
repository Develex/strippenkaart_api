<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210319121427 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE history (id INT AUTO_INCREMENT NOT NULL, changed_by_id INT NOT NULL, entity_id INT NOT NULL, record_number INT NOT NULL, date_changed DATETIME NOT NULL, INDEX IDX_27BA704B828AD0A0 (changed_by_id), INDEX IDX_27BA704B81257D5D (entity_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE payment (id INT AUTO_INCREMENT NOT NULL, stripcard_id_id INT NOT NULL, status_id INT NOT NULL, quantity INT NOT NULL, amount NUMERIC(10, 2) NOT NULL, discount NUMERIC(10, 2) NOT NULL, date_created DATETIME NOT NULL, date_paid DATETIME DEFAULT NULL, INDEX IDX_6D28840D6BA452E (stripcard_id_id), INDEX IDX_6D28840D6BF700BD (status_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE status (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE stripcard (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, strips INT NOT NULL, UNIQUE INDEX UNIQ_9DB34C44A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE table_name (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, expires TINYINT(1) NOT NULL, expires_at DATETIME DEFAULT NULL, access_token VARCHAR(255) DEFAULT NULL, active TINYINT(1) NOT NULL, verified TINYINT(1) NOT NULL, verification_code VARCHAR(255) DEFAULT NULL, UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), UNIQUE INDEX UNIQ_8D93D649B6A2DD68 (access_token), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE history ADD CONSTRAINT FK_27BA704B828AD0A0 FOREIGN KEY (changed_by_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE history ADD CONSTRAINT FK_27BA704B81257D5D FOREIGN KEY (entity_id) REFERENCES table_name (id)');
        $this->addSql('ALTER TABLE payment ADD CONSTRAINT FK_6D28840D6BA452E FOREIGN KEY (stripcard_id_id) REFERENCES stripcard (id)');
        $this->addSql('ALTER TABLE payment ADD CONSTRAINT FK_6D28840D6BF700BD FOREIGN KEY (status_id) REFERENCES status (id)');
        $this->addSql('ALTER TABLE stripcard ADD CONSTRAINT FK_9DB34C44A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE payment DROP FOREIGN KEY FK_6D28840D6BF700BD');
        $this->addSql('ALTER TABLE payment DROP FOREIGN KEY FK_6D28840D6BA452E');
        $this->addSql('ALTER TABLE history DROP FOREIGN KEY FK_27BA704B81257D5D');
        $this->addSql('ALTER TABLE history DROP FOREIGN KEY FK_27BA704B828AD0A0');
        $this->addSql('ALTER TABLE stripcard DROP FOREIGN KEY FK_9DB34C44A76ED395');
        $this->addSql('DROP TABLE history');
        $this->addSql('DROP TABLE payment');
        $this->addSql('DROP TABLE status');
        $this->addSql('DROP TABLE stripcard');
        $this->addSql('DROP TABLE table_name');
        $this->addSql('DROP TABLE user');
    }
}
